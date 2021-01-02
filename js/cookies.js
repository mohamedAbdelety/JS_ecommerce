
(function () {

    var Cookie = {
        getCookie: function (cookieName) {
            var cookies = []
            var Arr = document.cookie.split("; ");
            for (var i = 0; i < Arr.length; i++) {
                var cookie = Arr[i].split("=");
                cookies[cookie[0]] = cookie[1];
            }

            return decodeURIComponent(cookies[cookieName]);
        },


        setCookie: function (cookieName, cookieValue, expireDate) {
            document.cookie = cookieName + "=" + encodeURIComponent(cookieValue) + (expireDate ? ";expires=" + expireDate.toUTCString() : "");
        },

        deleteCookie: function (cookieName) {
            var oldDate = new Date();
            oldDate.setFullYear(2000);
            document.cookie = cookieName + "=;expires=" + oldDate;
        },

        allCookieList: function () {
            var cookies = []
            var Arr = decodeURIComponent(document.cookie).split("; ");
            for (var i = 0; i < Arr.length; i++) {
                var cookie = Arr[i].split("=");
                cookies[cookie[0]] = cookie[1];
            }
            return cookies;
        },

        hasCookie: function (cookieName) {
            return this.allCookieList()[cookieName] != undefined;
        }
    };

    var _Cookie = window.Cookie,
        _$C = window.$C;

    Cookie.noConflict = function (deep) {
        if (window.$C === Cookie) {
            window.$C = _$C;
        }

        if (deep && window.Cookie === Cookie) {
            window.Cookie = _Cookie;
        }

        return Cookie;

    };

    window.Cookie = window.$C = Cookie;
})();
