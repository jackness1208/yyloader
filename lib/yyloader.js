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
    // - vars

    var localData = {};
    if (LOCAL_STORAGE_SPPORTED) {
        try {
            localData = JSON.parse(window.localStorage.getItem(LOCAL_STORAGE_NAME)) || {};
        } catch (er) {}
    }

    var cache = {
        queues: []
    };
    var fn = {
        rouder: function(src, done) {
            var key;
            var hash;
            if (src.match(HASH_REG)) {
                key = src.replace(HASH_REG, '$1$3');
                hash = src.replace(HASH_REG, '$2');
            } else {
                key = src;
            }

            if (localData[key] && (!hash || localData[key].hash == hash)) {
                return done(null, localData[key].tpl);
            } else {
                $.ajax({
                    url: src,
                    success: function(tpl) {
                        if (LOCAL_STORAGE_SPPORTED) {
                            localData[key] = {
                                hash: hash,
                                tpl: tpl
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
        }
    };

    var yyloader = function(ctx) {
        $(ctx).each(function() {
            var $el = $(this);
            console.log($el);
            var src = $el.data('component');
            if (!src) {
                return;
            }
            fn.rouder(src, function(err, tpl) {
                if (err) {
                    throw new Error(['yyloader loaded error:', src].join(' '));
                }
                $(tpl).insertBefore($el);
                $el.remove();
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
