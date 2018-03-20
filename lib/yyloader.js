'use strict';
(function() {
    if (!window.$) {
        throw new Error('yyl-loader required jquery');
    }

    var $ = window.$;

    // + vars
    var LOCAL_STORAGE_NAME = 'yylloader_data';
    var LOCAL_STORAGE_SPPORTED = window.localStorage;
    var HASH_REG = /(^.+-)([a-zA-Z0-9]{8})(\..+$)/;
    var EXPRIE_TIME = 60 * 60 * 1000;
    var NOW = new Date().getTime();
    // - vars

    var localData = {};
    if (LOCAL_STORAGE_SPPORTED) {
        try {
            localData = JSON.parse(window.localStorage.getItem(LOCAL_STORAGE_NAME)) || {};
        } catch (er) {}

        // 去掉过期的数据
        var needUpdate = false;
        for (var key in localData) {
            if (
                localData.hasOwnProperty(key) &&
                NOW - localData[key].now > EXPRIE_TIME
            ) {
                delete localData[key];
                needUpdate = true;
            }
        }
        if (needUpdate) {
            window.localStorage.setItem(
                LOCAL_STORAGE_NAME,
                JSON.stringify(localData)
            );
        }
    }

    var cache = {
        queues: [],
        readyModule: {

        },
        waitings: []
    };
    var fn = {
        rouder: function(param, done) {
            if (localData[param.name] && localData[param.name].url == param.url) {
                return done(null, localData[param.name].tpl);
            } else {
                $.ajax({
                    url: param.url,
                    success: function(tpl) {
                        if (LOCAL_STORAGE_SPPORTED) {
                            localData[param.name] = {
                                url: param.url,
                                tpl: tpl,
                                date: new Date().getTime()
                            };
                            window.localStorage.setItem(
                                LOCAL_STORAGE_NAME,
                                JSON.stringify(localData)
                            );
                        }
                        return done(null, tpl);
                    },
                    error: function(er) {
                        return done(er);
                    }
                });
            }
        },
        addWaiting: function(ref, fn) {
            cache.waitings.push({
                ref: ref,
                fn: fn
            });
        },
        checkModuleReady: function(ref) {
            var canRun = true;
            $(ref).each(function(index, name) {
                if (!name) {
                    return;
                }
                if (!cache.readyModule[name]) {
                    canRun = false;
                    return true;
                }
            });
            return canRun;
        },
        checkWaiting: function() {
            if (cache.waitings.length) {
                for (var i = 0; i < cache.waitings.length;) {
                    if (fn.checkModuleReady(cache.waitings[i].ref)) {
                        cache.waitings.splice(i, 1)[0].fn();
                    } else {
                        i++;
                    }
                }
            }
        }
    };

    var yyloader = function(ctx) {
        $(ctx).each(function() {
            var $el = $(this);
            var url = $el.data('loader-url');
            var name = $el.data('loader-name');
            var ref = $el.data('loader-ref');

            if (ref) {
                ref = ref.split(/\n*,\n*/);
            } else {
                ref = [];
            }

            var finishHandle = function(tpl) {
                $(tpl).insertBefore($el);
                $el.remove();
                cache.readyModule[name] = true;
                fn.checkWaiting();
            };
            if (!url) {
                return;
            }
            if (!name) {
                name = $el.attr('id');
            }
            fn.rouder({
                url: url,
                name: name
            }, function(err, tpl) {
                if (err) {
                    throw new Error(['yyloader loaded error:', url].join(' '));
                }

                if (fn.checkModuleReady(ref)) {
                    finishHandle(tpl);
                } else {
                    fn.addWaiting(ref, function() {
                        finishHandle(tpl);
                    });
                }
            });
        });
    };

    if (typeof define != 'undefined' && define.amd) {
        define([], function() {
            return yyloader;
        });
    } else if (typeof module != 'undefined' && module.exports) {
        module.exports = yyloader;
    } else {
        window.yyloader = yyloader;
    }
})();
