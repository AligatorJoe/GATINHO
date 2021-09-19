// ==UserScript==
// @name		Gatinho
// @namespace   Gatinho
// @version		4.57.12
// @author		JoeMan
// @description Gatinho é uma pequena extençao para o jogo browser Grepolis. (counter, displays, smilies, trade options, changes to the layout)
// @include     http://*.grepolis.com/*
// @include     https://*.grepolis.com/*
// @exclude 	https://*.forum.grepolis.com/*
// @require		http://ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js
// @icon		https://i.imgur.com/1S9gut4.png
// @icon64URL		https://i.imgur.com/1S9gut4.png
// @license     GPL-3.0
// @grant		GM_info
// @grant		GM_setValue
// @grant		GM_getValue
// @grant		GM_deleteValue
// @grant		GM_xmlhttpRequest
// @grant		GM_getResourceURL
// @source  a derivative of the old Dio Tools abandoned since 2016
// @downloadURL https://github.com/AligatorJoe/Dio-Tools-2019/raw/master/Gatinho.user.js
// ==/UserScript==
var version = '4.57.12';
                   /////////////////////////////////////////////////////////////////////////////////////////
                  //  * @license  GPL-3.0                                                                //
                 //                                                                                     //
                //  This program is free software: you can redistribute it and/or modify               //
               //   it under the terms of the GNU General Public License as published by              //
              //    the Free Software Foundation, either version 3 of the License, or                //
             //     (at your option) any later version.                                             //
            //                                                                                     //
           //       This program is distributed in the hope that it will be useful,               //
          //        but WITHOUT ANY WARRANTY; without even the implied warranty of               //
         //         MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the               //
        //          GNU General Public License for more details.                               //
       //                                                                                     //
      //            You should have received a copy of the GNU General Public License        //
     //             along with this program.  If not, see <https://www.gnu.org/licenses/>.  //
    /////////////////////////////////////////////////////////////////////////////////////////
var style = document.createElement('style');
style.type = 'text/css';
style.innerHTML =
    '.attack_support_window .game_border {  border-left: none; border-bottom: 1px solid #575; box-shadow: -10px 2px 3px black; } ' +
    'div.game_border { background-color: #0000;} ' +
    document.getElementsByTagName('head')[0].appendChild(style);
var uw = unsafeWindow || window,
    $ = uw.jQuery || jQuery,
    DATA, GM;
GM = (typeof GM_info === 'object');
console.log('%c|= Gatinho is active =|', 'color: green; font-size: 1em; font-weight: bolder; ');
function loadValue(name, default_val) {
    var value;
    if (GM) {
        value = GM_getValue(name, default_val);
    } else {
        value = localStorage.getItem(name) || default_val;
    }
    if (typeof(value) === "string") {
        value = JSON.parse(value)
    }
    return value;
}
if (GM && (uw.location.pathname.indexOf("game") >= 0)) {
    var WID = uw.Game.world_id,
        MID = uw.Game.market_id,
        AID = uw.Game.alliance_id;
    DATA = {
        options: loadValue("options", "{}"),
        user: loadValue("joe_user", "{}"),
        count: loadValue("joe_count", "[]"),
        notification: loadValue('notif', '0'),
        error: loadValue('error', '{}'),
        spellbox: loadValue("spellbox", '{ "top":"23%", "left": "-150%", "show": false }'),
        commandbox: loadValue("commandbox", '{ "top":55, "left": 250 }'),
        tradebox: loadValue("tradebox", '{ "top":55, "left": 450 }'),
        townTypes: loadValue(WID + "_townTypes", "{}"),
        sentUnits: loadValue(WID + "_sentUnits", '{ "attack": {}, "support": {} }'),
        biremes: loadValue(WID + "_biremes", "{}"),
        bullseyeUnit: loadValue(WID + "_bullseyeUnit", '{ "current_group" : -1 }'),
        worldWonder: loadValue(WID + "_wonder", '{ "ratio": {}, "storage": {}, "map": {} }'),
        clickCount: loadValue(WID + "_click_count", '{}'),
        statistic: loadValue(WID + "_statistic", '{}'),
        worldWonderTypes: loadValue(MID + "_wonderTypes", '{}')
    };
    if (!DATA.worldWonder.map) {
        DATA.worldWonder.map = {};
    }
    if (typeof DATA.options.trd == 'boolean') {
        DATA.options.per = DATA.options.rec = DATA.options.trd;
        delete DATA.options.trd;
    }
    if (typeof DATA.options.mov == 'boolean') {
        DATA.options.act = DATA.options.mov;
        delete DATA.options.mov;
    }
    if (typeof DATA.options.twn == 'boolean') {
        DATA.options.tic = DATA.options.til = DATA.options.tim = DATA.options.twn;
        delete DATA.options.twn;
    }
    if (GM) GM_deleteValue("notification");
}
uw.saveValueGM = function(name, val) {
    setTimeout(function() {
        GM_setValue(name, val);
    }, 0);
};
uw.deleteValueGM = function(name) {
    setTimeout(function() {
        GM_deleteValue(name);
    }, 0);
};
uw.getImageDataFromCanvas = function(x, y) {};
uw.calculateConcaveHull = function() {
    var contour = [
        new poly2tri.Point(100, 100),
        new poly2tri.Point(100, 300),
        new poly2tri.Point(300, 300),
        new poly2tri.Point(300, 100)
    ];
    var swctx = new poly2tri.SweepContext(contour);
    swctx.triangulate();
    var triangles = swctx.getTriangles();
    return triangles;
};
if (typeof exportFunction == 'function') {
    exportFunction(uw.saveValueGM, unsafeWindow, {
        defineAs: "saveValueGM"
    });
    exportFunction(uw.deleteValueGM, unsafeWindow, {
        defineAs: "deleteValueGM"
    });
    exportFunction(uw.calculateConcaveHull, unsafeWindow, {
        defineAs: "calculateConcaveHull"
    });
    exportFunction(uw.getImageDataFromCanvas, unsafeWindow, {
        defineAs: "getImageDataFromCanvas"
    });
} else {}
var time_a, time_b;

function appendScript() {
    if (document.getElementsByTagName('body')[0]) {
        var joescript = document.createElement('script');
        joescript.type = 'text/javascript';
        joescript.id = 'felix';
        time_a = uw.Timestamp.client();
        joescript.textContent = JOE_GAME.toString().replace(/uw\./g, "") + "\n JOE_GAME('" + version + "', " + GM + ", '" + JSON.stringify(DATA).replace(/'/g, "##") + "', " + time_a + ");";
        document.body.appendChild(joescript);
    } else {
        setTimeout(function() {
            appendScript();
        }, 500);
    }
}
if (location.host === "www.grepotemas.blogspot.com") {
    JOE_PAGE();
} else if ((uw.location.pathname.indexOf("game") >= 0) && GM) {
    appendScript();
} else {
    JOE_FORUM();
}
function JOE_PAGE() {
    if (typeof GM_info == 'object') {
        setTimeout(function() {
            joe_user = JSON.parse(loadValue("joe_user", ""));
            console.log(joe_user);
            uw.joe_version = parseFloat(version);
        }, 0);
    } else {
        joe_user = localStorage.getItem("joe_user") || "";

        joe_version = parseFloat(version);
    }
}
function JOE_FORUM() {
    var smileyArray = [];
    var _isSmileyButtonClicked = false;
    smileyArray.standard = [
        "DPei3Qp", "bF0eB0f", "UKoHx8d", "U2tkUnL", "ZGd6diZ", "zsPaXt8", "b4yMHCR", "hMXNOWf", "zv3BwBY", "qb8pitw", "SbMOcW9", "6FAaoBZ", "qIxx6MK", "PB3b8gF", "c8q9rca",
        "3jYy90T", "kLr9s0f", "YJHTAE3", "biciJ8C", "rYRsXXg", "n3FYkXU", "xfAbFHj", "XXMqg0h", "t7Rmp6H", "jBPovq6", "ap2aCHN", "Yg6IQsU", "ahNHR4q", "Zd2EmoR", "XI4NzYy",
        "Q9mCXUA", "mCZqjVB", "1jq12ek", "FbOZeIT", "bTcfr5e", "CpaHDIz", "F3qc6rd", "bDfT0tg", "TrF7R27", "gAtIHDX", "ORz3hPI", "HjxgBNH", "Ke622SY", "DUmEAis", "nilUSGI",
        "DdWESJH", "SVbNcMj", "zsSbQlY"
    ];
    smileyArray.grepolis = [
        "fZlUp0N", "gd5KESZ", "oeM5qth", "TUQzCP4", "LeA4Ywj", "jQImYnY", "AuNco88", "Bp9YqV5", "UD9cFTA", "i6NxVsa", "AeeeaJd", "tyf31v4", "ogmI6xR", "27BdyyZ", "dXEfuay",
        "Iah41x6", "4sC6ypq", "k5tnTFX", "2w3xZnz"
    ];
    var ForumObserver = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.addedNodes[0]) {
                if (mutation.addedNodes[0].className === "redactor_box") {
                    ForumObserver.observe($(".redactor_box").get(0), {
                        attributes: false,
                        childList: true,
                        characterData: false,
                        subtree: true
                    });
                }
                if (_isSmileyButtonClicked === false && mutation.addedNodes[0].className === "redactor_toolbar") {
                    $(".redactor_btn_smilies").click();
                    _isSmileyButtonClicked = true;
                }
                if (mutation.addedNodes[0].className === "redactor_smilies") {
                    ForumObserver.disconnect();
                    $(".smilieCategory ul").empty();
                    for (var smiley in smileyArray.standard) {
                        if (smileyArray.standard.hasOwnProperty(smiley)) {
                            $(".smilieCategory ul").append(
                                '<li class="Smilie" data-text="">' +
                                '<img src="https://i.imgur.com/' + smileyArray.standard[smiley] + '.gif" title="" alt="" data-smilie="yes">' +
                                '</li>'
                            );
                        }
                    }
                    $(".smilieCategory ul").append("<br><br>");
                    for (var smiley in smileyArray.grepolis) {
                        if (smileyArray.grepolis.hasOwnProperty(smiley)) {
                            $(".smilieCategory ul").append(
                                '<li class="Smilie" data-text="">' +
                                '<img src="https://i.imgur.com/' + smileyArray.grepolis[smiley] + '.gif" title="" alt="" data-smilie="yes">' +
                                '</li>'
                            );
                        }
                    }

                    _isSmileyBarOpened = true;
                }
            }
        });
    });
    if ($(".redactor_btn_smilies").get(0)) {
        $(".redactor_btn_smilies").click();

        _isSmileyButtonClicked = true;
    }
    if ($("#QuickReply").get(0)) {
        ForumObserver.observe($("#QuickReply div").get(0), {
            attributes: false,
            childList: true,
            characterData: false,
            subtree: true
        });
    } else if ($("#ThreadReply").get(0)) {
        ForumObserver.observe($("#ThreadReply div").get(0), {
            attributes: false,
            childList: true,
            characterData: false,
            subtree: true
        });
    } else if ($("form.Preview").get(0)) {
        ForumObserver.observe($("form.Preview .ctrlUnit dd div").get(0), {
            attributes: false,
            childList: true,
            characterData: false
        });
    } else if (typeof($("form.AutoValidator").get(0)) !== "undefined") {

        ForumObserver.observe($("form.AutoValidator .messageContainer div").get(0), {
            attributes: false,
            childList: true,
            characterData: false
        });
    }
}
function JOE_GAME(version, gm, DATA, time_a) {
    var MutationObserver = uw.MutationObserver || window.MutationObserver,
        WID, MID, AID, PID, LID, updateversion,
        updateversion = version.replace(/\./g, "-");
    joe_sprite = "https://i.imgur.com/HQq4rV1.png"; //"https://i.imgur.com/cILbyDs.png";
    joe_icon = '<img src="https://i.imgur.com/bW8lxNz.gif" style="width: 15px;float:left;margin: 1px 4px 0px -3px">';
    if (uw.location.pathname.indexOf("game") >= 0) {
        DATA = JSON.parse(DATA.replace(/##/g, "'"));
        WID = uw.Game.world_id;
        MID = uw.Game.market_id;
        AID = uw.Game.alliance_id;
        PID = uw.Game.player_id;
        LID = uw.Game.locale_lang.split("_")[0];
        Game.hasArtemis = true;
    }
    $.prototype.reverseList = [].reverse;
    $.fn.toggleClick = function() {
        var methods = arguments;
        var count = methods.length;
        return this.each(function(i, item) {
            var index = 0;
            $(item).on('click', function() {
                return methods[index++ % count].apply(this, arguments);
            });
        });
    };
    function saveValue(name, val) {
        if (gm) {
            saveValueGM(name, val);
        } else {
            localStorage.setItem(name, val);
        }
    }
    function deleteValue(name) {
        if (gm) {
            deleteValueGM(name);
        } else {
            localStorage.removeItem(name);
        }
    }
    /////////////////////////////////////////
   //         * Graphic filters *         //
  /////////////////////////////////////////
    if (uw.location.pathname.indexOf("game") >= 0) {
        $('<svg width="0%" height="0%">' +
            '<filter id="GrayScale">' +
            '<feColorMatrix type="matrix" values="0.2126 0.7152 0.0722 0 0 0.2126 0.7152 0.0722 0 0 0.2126 0.7152 0.0722 0 0 0 0 0 1 0">' +
            '</filter>' +
            '<filter id="Sepia">' +
            '<feColorMatrix type="matrix" values="0.343 0.669 0.119 0 0 0.249 0.626 0.130 0 0 0.172 0.334 0.111 0 0 0.000 0.000 0.000 1 0">' +
            '</filter>' +
            '<filter id="Saturation"><feColorMatrix type="saturate" values="0.2"></filter>' +
            '<filter id="Saturation1"><feColorMatrix type="saturate" values="1"></filter>' +
            '<filter id="Saturation2"><feColorMatrix type="saturate" values="2"></filter>' +
            '<filter id="Hue1"><feColorMatrix type="hueRotate" values= "65"></filter>' +
            '<filter id="Hue2"><feColorMatrix type="hueRotate" values="150"></filter>' +
            '<filter id="Hue3"><feColorMatrix type="hueRotate" values="-65"></filter>' +
            '<filter id="Brightness15">' +
            '<feComponentTransfer><feFuncR type="linear" slope="1.5"/><feFuncG type="linear" slope="1.5"/><feFuncB type="linear" slope="1.5"/></feComponentTransfer>' +
            '</filter>' +
            '<filter id="Brightness12">' +
            '<feComponentTransfer><feFuncR type="linear" slope="1.2"/><feFuncG type="linear" slope="1.2"/><feFuncB type="linear" slope="1.2"/></feComponentTransfer>' +
            '</filter>' +
            '<filter id="Brightness11">' +
            '<feComponentTransfer><feFuncR type="linear" slope="1.1"/><feFuncG type="linear" slope="1.1"/><feFuncB type="linear" slope="1.1"/></feComponentTransfer>' +
            '</filter>' +
            '<filter id="Brightness10">' +
            '<feComponentTransfer><feFuncR type="linear" slope="1.0"/><feFuncG type="linear" slope="1.0"/><feFuncB type="linear" slope="1.0"/></feComponentTransfer>' +
            '</filter>' +
            '<filter id="Brightness07">' +
            '<feComponentTransfer><feFuncR type="linear" slope="0.7"/><feFuncG type="linear" slope="0.7"/><feFuncB type="linear" slope="0.7"/></feComponentTransfer>' +
            '</filter>' +
            '</svg>').appendTo('#ui_box');
    }
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
   //  *  Language versions// German/Néerlandais/English/French/Russian/Polish/Spanish/Finnois/Grec/Hongrois/Romanian/Italian  *   //
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////
   //  Germany (DE) Translation by  JoeMan   //
  ////////////////////////////////////////////
    var LANG = {
        de: {
            link: {
                Update: "https://mycitygre.000webhostapp.com/Dio-Tools/Dio_tools/changelog-en/index.html",
                contact: "http://grepotemas.blogspot.com/",
                forum: "https://mycitygre.000webhostapp.com/Dio-Tools/index.html",
                UnitComparison: "https://wiki.en.grepolis.com/wiki/Units_Portal/"
            },
            settings: {
                dsc: "Gatinho bietet, unter anderem, einige Bildschirme, ein Smiley-Box, Handel mit Optionen	<br> und einige Änderungen im Layout.",
                prv: "Vorschau mehrere Funktionen:",
                act: "Aktivieren / Deaktivieren der Toolkit-Funktionen:",
                version_old: "Die Version wird nicht aktualisiert",
                version_new: "Version aktualisiert wird",
                version_dev: "Entwicklerversion",
                version_update: "Aktualisieren",
                cat_wonders: "WW",
                Update: "Aktuelle Version V" + version,
                link_forum: "http://forum.de.grepolis.com/showthread.php?28838&goto=newpost",
                link_contact: "http://forum.de.grepolis.com/private.php?do=newpm&u=10548",
                link_Excel: "https://docs.zoho.com/file/5y2lva773ddcde22f4ebc8febadec843aaceb",
                forum: "Forum",
                author: "Autor",
                Feature: "Neue Funktion",
                cat_units: "Einheiten",
                cat_icons: "Icons in den Städten",
                cat_forum: "Forum",
                cat_trade: "Handel",
                cat_wonders: "WW",
                cat_layout: "Layout",
                cat_other: "Andere",
                cat_moi: "Zusätzlich",
                cat_nova: "Prämie",
                cat_them: "🎨"
            },
            options: {
                Blue: 'Blau',
                Red: 'Rot',
                Purple: 'Violett',
                Yellow: 'Gelb',
                Pink: 'Rosa',
                Halloween: 'Halloween',
                Christmas: 'Weihnachten',
                Dead: 'Loch',
                Abes: 'Abes',
                Groot: 'Groot',
                themco: 'Die farbigen',
                themgif: 'Die animierten',
                test: ["Aktivieren/Deaktivieren Sie die Liste der farbigen Themen ", "Wählen Sie eines der verfügbaren Designs (Farbdesigns)."],
                ava: ["Übersicht der Einheiten	", "Zeigt die Einheiten aller Städte"],
                sml: ["Smiles", "Erweitert die bbcode mit einer Smiley-Box"],
                str: ["Stärke der Truppen", "Fügt Leistungsrahmen Truppen in mehreren Bereichen"],
                tra: ["Transportkapazität", "Zeigt die damit beschäftigt Transportkapazität und in dem Antrieb Menü"],
                per: ["Handel Prozent", "Erweitert das Handelsfenster mit einem Handelsprozent"],
                rec: ["Commerce für die Rekrutierung", "Erweitert das Handelsfenster mit einem Einstellungs Handel"],
                cnt: ["Gegenantrag", "Kontern / Unterstützung bei der Erreichung Fenster"],
                way: ["Military Geschwindigkeit", "Displays zeigt die mögliche Truppengeschwindigkeit im Angriff Fenster / support"],
                sim: ["Simulator", "Anpassung des Simulators Layouts & Dauerausstellung der erweiterten Befugnis Box"],
                spl: ["Cash göttliche Kräfte", "Kleine & bewegliche magnetische Kräfte Gottesfeld (mit Positionsspeicher)"],
                pop: ["göttliche Gunst-Box", "Ändert die göttliche Gunst mit einem neuen Layout-Box"],
                tsk: ["Taskleiste", "Erhöht die Taskleiste und minimiert tägliche Belohnung Fenster am Anfang"],
                for: ["Form Excel", "Excel-Formular für Siege"],
                bbc: ["Anwendungsunterstützung	", "Verlängert bbcode Bar mit einer Art und Weise Unterstützung Automatische anfordern"],
                com: ["Einheiten Vergleich", "Drive Vergleichstabellen"],
                tic: ["Icons in den Städten", "Jede Stadt erhält ein Symbol für die Art der Truppen in der Stadt (automatische Erkennung)", "weitere Symbole sind für die manuelle Auswahl zur Verfügung"],
                til: ["Liste der Städte", "Fügt die Symbole in der Liste der Städte der Stadt"],
                tim: ["Karte", "Zeigt Symbole der Städte auf der strategischen Karte"],
                wwc: ["WW-Rechner", "& Shared Zähler Ressourcenberechnung + vorherige und nächste Schaltflächen Weltwunder (derzeit nicht deaktiviert!)"],
                wwr: ["Einstufung", "Die Einstufung der Wunder der Welt neu gestaltet"],
                wwi: ["icons", "Fügt Symbole in dem Weltwunder in der strategischen Karte"],
                con: ["Kontextmenü", "Austausch „Select City“ und „Übersicht der Städte“ aus dem Kontextmenü"],
                sen: ["Sent Einheiten", "Shows Einheiten geschickt im Angriff / support Fenster	"],
                tov: ["Stadtblick", "Ersetzt das neue Panorama der Stadt mit dem Stil des alten Fensters"],
                scr: ["Mausrad", "Änderungen mit moleta Maus, Vision Island / Karte"],
                stt: ["statistiques Grepodata", "Fügt eine Schaltfläche, um die statische Welt zu sehen"],
                err: ["Senden Sie automatisch Fehlerberichte", "Wenn Sie diese Option aktivieren, können Sie helfen, Fehler zu identifizieren."],
                Tti: ["Handel Ressourcen für Festivals", "Klicken Sie auf Ressourcen zu einem Festival schicken"],
                Isl: ["island View", "Erhöhen Sie die Höhe der Liste der Städte und Gemeinden."],
                Ish: ["Die Ressourcen der Dörfer (aktiv Kapitän)", "(Sammeln Sie alle recussos die Inseln in 1 Klick)"],
                Exi: ["Anforderung:", "💰 Aktivieren ->"],
                OCC: ["	Ozean-Nummer", "Visualisa Ozean numero"],
                BBV: ["	Stadt in BB-Kodex", "Fügt die aktuelle Stadt BBcodigo"],
                CVW: ["	Button Stadt / Karte", "Fügt eine Schaltfläche zwischen der Vision und der Stadtkarte zu wechseln."],
                Mess: ["Danke für dein Vertrauen", "Zur Verfügung stellt neue Module für falicidar Ihres täglichen Aufgaben im Spiel, geprüft und genehmigt.!."],
                Ciw: ["	Blick auf die Stadt / Fenster", "Anzeigen Blick auf die Stadt in einem Fenster"],
                act: ["	Aktivieren Sie im Dropdown-Box und Handel Angriff", "Anzeige Erweiterungen Handel Boxen und Rekrutierung (mit Positionsspeicher)"],
                Bjc: ["	Button BB-Code", "Hinzufügen einer Schaltfläche BBcode (Spieler und Allianz)"],
                SUA: ["	Hinzufügen (keine Überlast / Reset)", "Neue Werkzeuge in Angriff und Support-Fenster."],
                Mse: ["	BB-Kodex menssagens", "Wandelt menssagens in BB-Kodex"],
                Cul: ["	Überblick über Kultur (Administrator)", "Fügt eine Zählung aller Paraden"],
                Hid: ["	In den Höhlen", "Fügt Silber in die Höhle, wenn die Lease hat über 15k.	"],
                Hio: ["	Mit Blick auf die Höhlen (Administrator)", "5 Kategorien vorhanden suchen."],
                ubv: ["	Kapazität Bevölkerung", "Unterstützung Kapazität - von der Insel	"],
                her: ["	Eroberung thrakischen", "Karte Größenreduzierung thrakischen Leistung."]
            },
            Quack: {
                cityfestivals: "urban Festival",
                olympicgames: "Olympische Spiele",
                triumph: "Victory Parade",
                theater: "Theateraufführungen"
            },
            labels: {
                stt: "statistiques Grepodata",
                uni: "Übersicht der Einheiten",
                total: "weltweit",
                available: "Verfügbar",
                outer: "aus",
                con: "Stadt wählen",
                no_overload: "ohne Überlastung",
                std: "Standard",
                gre: "Grepolis",
                nat: "Natürlich",
                ppl: "Beliebt",
                oth: "Andere",
                hal: "Halloween",
                xma: "Weihnachten",
                ttl: "Anwendungsunterstützung",
                inf: "Stadtinfo:",
                dev: "Präzision",
                det: "detaillierte Einheiten",
                prm: "Bonus Premium",
                sil: "Silber an der Grotte",
                mov: "Bewegungen in der Stadt:",
                WaUp: "Wand<25",
                Rev2: "Flamme R2",
                Def1: "Verteidigung Terre",
                Bir1: "Verteidigung Birremes",
                OC: "OC",
                R2: "R2 Top:",
                FR2: " Ende R2: ",
                f_R212: "Aufstand 12H",
                f_R210: "Aufstand 10H",
                NTS: "Einheiten ohne Details",
                fooster: "👆 / 👇 oder nichts",
                leg: "WW Wonders",
                stg: "Niveau",
                tot: "Gesamt",
                str: "Power Units",
                los: "Verluste",
                mod: "Kein Modifikator Einfluss",
                dsc: "Vergleichseinheiten",
                hck: "Einschlag",
                prc: "Schnitt",
                dst: "Arremço",
                sea: "Marine",
                att: "Beleidigend",
                def: "Defensive",
                spd: "Geschwindigkeit",
                bty: "Beute (Ressourcen)",
                cap: "Die Fähigkeit, Transport",
                res: "Kosten (Ressourcen)",
                fav: "Gefallen",
                tim: "Zeit Recruitment (n)",
                BBV: "BB-Code Stadt",
                rat: "Ressourcen-Verhältnis von einer Art von Einheit",
                shr: "Aus dem Speicher auf der Zielstadt",
                per: "	andel Prozent",
                lab: "abgeschickt Einheiten",
                cityfestivals: "städtische Feste",
                improved_movement: "Truppen fahren mit Bonus-Einstellung",
                cap_of_invisibility: "Zeitpunkt der Unsichtbarkeit, Zeitpunkt des Wirkungsendes"
            },
            messages: {
                export: "Convert Nachricht an BB-Kodex",
                Tol: "Copiar e colar",
                copy: "Kopieren",
                bbmessages: "BB-Kodex Nachrichten",
                copybb: "BB-Kodex wurde kopiert",
            },
            grepo_mainmenu: {
                city_view: "Stadtblick",
                island_view: "Blick auf die Insel"
            },
            buttons: {
                sav: "Speichern",
                ins: "Speichern",
                res: "Reset"
            }
        },
        ///////////////////////////////////////////
       //  Italian (it) Translation by  JoeMan  //
      ///////////////////////////////////////////
        it: {
            link: {
                Update: "https://mycitygre.000webhostapp.com/Dio-Tools/Dio_tools/changelog-en/index.html",
                contact: "http://grepotemas.blogspot.com/",
                forum: "https://mycitygre.000webhostapp.com/Dio-Tools/index.html",
                UnitComparison: "https://wiki.en.grepolis.com/wiki/Units_Portal/"
            },
            settings: {
                dsc: "Gatinho offre, tra le altre cose, alcune schermate, una scatola smiley, trading di opzioni	<br> e alcuni cambiamenti nel layout.",
                prv: "Anteprima di diverse caratteristiche:",
                act: "Abilitare / disabilitare il toolkit dispone di:",
                version_old: "La versione non viene aggiornato",
                version_new: "La versione viene aggiornato",
                version_dev: "versione per sviluppatori",
                version_update: "aggiornare",
                cat_wonders: "WW",
                Update: "Versione corrente V" + version,
                link_forum: "https://mycitygre.000webhostapp.com/Dio-Tools/index.html",
                link_contact: "https://mycitygre.000webhostapp.com/Dio-Tools/index.html",
                link_Excel: "https://docs.zoho.com/file/5y2lva773ddcde22f4ebc8febadec843aaceb",
                forum: "Forum",
                author: "Autore",
                Feature: "Nuova caratteristica",
                cat_units: "unità",
                cat_icons: "Le icone nelle città",
                cat_forum: "Forum",
                cat_trade: "Commercio",
                cat_wonders: "WW",
                cat_layout: "disposizione",
                cat_other: "Altri",
                cat_moi: "addizionale",
                cat_nova: "premio",
                cat_them: "🎨"
            },
            options: {
                Blue: 'Blu',
                Red: 'Rosso',
                Purple: 'Viola',
                Yellow: 'Gialo',
                Pink: 'Rosa',
                Halloween: 'Halloween',
                Christmas: 'Natale',
                Dead: 'Buco',
                Abes: 'Abes',
                Groot: 'Groot',
                themco: 'Quelli colorati',
                themgif: 'Quelli animati',
                test: ["Abilita/Disabilita l'elenco dei temi colorati ", "Seleziona uno dei temi disponibili, (Temi colore)."],
                ava: ["Panoramica delle unità", "Indica le unità di tutte le città"],
                sml: ["faccine", "Estende la bbcode con una scatola di smiley"],
                str: ["Forza di truppe", "Aggiunge potenza cornici truppe in diverse aree"],
                tra: ["capacità di trasporto", "Mostra la capacità di trasporto occupato e disponibili nel menu di azionamento	"],
                per: ["percentuale commercio", "Estende la finestra di scambio con una percentuale del commercio"],
                rec: ["Commercio per il reclutamento", "Estende la finestra di scambio con un commercio di reclutamento	"],
                cnt: ["Contatore movimento", "contrattacchi / supporto nella finestra di realizzazione	"],
                way: ["Velocità militare", "Display mostrano la velocità possibile truppa nella finestra di attacco / supporto	"],
                sim: ["Simulatore", "Adattamento del layout simulatore e mostra permanente della scatola poteri estesi	"],
                spl: ["Cash Powers Divine", "Piccole e mobili Box Magnetic poteri divini (con memoria di posizione)	"],
                pop: ["favori divini box", "Cambia i favori divini scatola con un nuovo layout"],
                tsk: ["barra delle applicazioni", "Aumenta la barra delle applicazioni e riduce al minimo la finestra ricompensa giornaliera all'inizio"],
                for: ["modulo Excel", "modulo Excel per Siege"],
                bbc: ["Supporto per l'applicazione", "Estende bar bbcode con un modo per richiedere supporto automatico"],
                com: ["confronto unità", "Aggiungere tabelle di confronto auto"],
                tic: ["Le icone nelle città	", "Ogni città riceve un'icona per il tipo di truppe in città (rilevamento automatico)", "icone aggiuntive sono disponibili per la selezione manuale"],
                til: ["Lista delle città", "Aggiunge le icone della città nella lista delle città"],
                tim: ["Carta geografica", "Mostra le icone delle città sulla mappa strategica"],
                wwc: ["WW Calculator", "E condiviso di risorse di calcolo contatore + pulsanti Indietro e Avanti meraviglie del mondo (attualmente non disattivato!)"],
                wwr: ["Classificazione", "Classificazione della meraviglia del mondo ridisegnato"],
                wwi: ["icone", "Aggiunge le icone nella meraviglia del mondo nella mappa strategica"],
                con: ["Menù contestuale", "Exchange Select City e Panoramica delle città dal menu contestuale"],
                sen: ["Apparecchi inviati", "unità Spettacoli inviati nella finestra di attacco / supporto"],
                tov: ["Vista della città", "Sostituisce il nuovo panorama della città con lo stile della vecchia finestra"],
                scr: ["Rotellina del mouse", "Modifiche con il mouse moleta, visione Island / Mappa"],
                stt: ["statistiques Grepodata", "Aggiunge un pulsante per vedere il mondo statico"],
                err: ["Invia automaticamente le segnalazioni di errori	", "Se si attiva questa opzione, è possibile aiutare a identificare gli errori."],
                Tti: ["risorse commerciali per le feste", "Fare clic per inviare le risorse per una festa"],
                Isl: ["island View	", "Aumentare l'altezza della lista di città e paesi."],
                Ish: ["Risorse dei villaggi (attivo capitano)", "(Raccogliere tutti recussos le isole in 1 click)"],
                Exi: ["Requisiti:", "💰 	Attiva ->"],
                OCC: ["Ocean Numero", "Visualisa Ocean numero"],
                BBV: ["Città in BB-Code", "Aggiunge la città corrente BBcodigo"],
                CVW: ["Pulsante Città / Mappa", "Aggiunge un pulsante per passare dalla visione e la mappa della città."],
                Mess: ["grazie per la tua fiducia", "Rendere disponibili nuovi moduli per falicidar il vostro giorno per giorno le attività nel gioco, testato e approvato.!"],
                Ciw: ["VISTA DELLA CITTÀ / finestra", "Mostra vedute della città in una finestra"],
                act: ["Abilita caselle a discesa e attacco Commerciale	", "Display migliorato commercio scatole e reclutamento (con memoria di posizione)"],
                Bjc: ["Pulsante BB-code", "L'aggiunta di un pulsante BBcode (giocatore e alleanza)"],
                SUA: ["Aggiungere (nessun sovraccarico / Reset)", "Nuovi strumenti in attacco e la finestra di supporto."],
                Mse: ["menssagens BB-Code", "Converte menssagens a BB-Code"],
                Cul: ["	Panoramica della cultura (Administrator)", "Aggiunge un conteggio di tutte le sfilate"],
                Hid: ["	Aggiungere alla grotta", "Aggiunge l'argento alla grotta nel magazzino hanno più di 15K."],
                Hio: ["	Vista delle grotte (Administrator)", "5 categorie disponibili di ricerca."],
                ubv: ["	popolazione di capacità	", "sostenere la capacità - al largo dell'isola	"],
                her: ["conquista della Tracia", "mappa riduzione delle dimensioni raggiungimento della Tracia."]
            },
            Quack: {
                cityfestivals: "urban Festival",
                olympicgames: "giochi Olimpici",
                triumph: "Victory Parade",
                theater: "spettacoli teatrali"
            },
            labels: {
                stt: "statistiques Grepodata",
                uni: "Panoramica delle unità",
                total: "Globale",
                available: "A disposizione",
                outer: "Su",
                con: "scegli la città",
                no_overload: "senza sovraccarico",
                std: "Standard",
                gre: "Grepolis",
                nat: "Naturale",
                ppl: "Popolare",
                oth: "Altri",
                hal: "Halloween",
                xma: "Natale",
                ttl: "Supporto per l'applicazione",
                inf: "Info città:",
                dev: "precisione",
                det: "unità dettagliate	",
                prm: "bonus Premium	",
                sil: "Argento alla Grotta",
                mov: "I movimenti in città:",
                WaUp: "Parete<25",
                Rev2: "Fiamma R2",
                Def1: "difesa Terre",
                Bir1: "difesa Birremes",
                OC: "OC",
                R2: "R2 Top:",
                FR2: " Fine R2: ",
                f_R212: "Rivolta 12H",
                f_R210: "Rivolta 10H",
                NTS: "Unità senza dettagli",
                fooster: "👆 / 👇 o niente",
                leg: "WW Meraviglie",
                stg: "Livello",
                tot: "Totale",
                str: "Alimentatori",
                los: "Perdite",
                mod: "Nessuna influenza modificatore",
                dsc: "unità di confronto",
                hck: "urto",
                prc: "Taglio",
                dst: "Arremço",
                sea: "Navale",
                att: "Offensivo",
                def: "Difensiva",
                spd: "velocità",
                bty: "Booty (risorse)",
                cap: "Capacità di trasporto",
                res: "Costo (risorse)",
                fav: "favore",
                tim: "Time Recruitment (s)",
                BBV: "BB-City Code",
                rat: "rapporto risorsa di un tipo di unità",
                shr: "Dal deposito sulla città di destinazione",
                per: "percentuale commercio",
                lab: "Apparecchi inviati",
                cityfestivals: "festival urbani",
                improved_movement: "Le truppe di auto con regolazione bonus",
                cap_of_invisibility: "Tempo di invisibilità, tempo di fine effetto"
            },
            messages: {
                export: "messaggio Converti in BB-Code	",
                Tol: "Copiar e colar",
                copy: "copia",
                bbmessages: "messaggi BB-Code",
                copybb: "BB-Code è stato copiato",
            },
            grepo_mainmenu: {
                city_view: "Vista della città",
                island_view: "Vista dell'isola"
            },
            buttons: {
                sav: "Salvare",
                ins: "Inserire",
                res: "Ripristina"
            }
        },
        ///////////////////////////////////////////
       //  Greece (EL)GR? Translation by JoeMan //
      ///////////////////////////////////////////

        el: {
            link: {
                Update: "https://mycitygre.000webhostapp.com/Dio-Tools/Dio_tools/changelog-en/index.html",
                contact: "http://grepotemas.blogspot.com/",
                forum: "https://mycitygre.000webhostapp.com/Dio-Tools/index.html",
                UnitComparison: "https://wiki.en.grepolis.com/wiki/Units_Portal/"
            },
            settings: {
                dsc: "ΔΗΩ-Εργαλεία προσφορές, μεταξύ άλλων, ορισμένες οθόνες, ένα χαμογελαστό κουτί, τις επιλογές των συναλλαγών <br> και κάποιες αλλαγές στη διάταξη.",
                prv: "Προεπισκόπηση πολλά χαρακτηριστικά:",
                act: "Ενεργοποίηση / απενεργοποίηση η εργαλειοθήκη χαρακτηριστικά:",
                version_old: "Έκδοση δεν ενημερώνεται",
                version_new: "Έκδοση ενημερώνεται",
                version_dev: "έκδοση του έργου",
                version_update: "εκσυγχρονίζω",
                cat_wonders: "WW",
                Update: "Τρέχουσα έκδοση V" + version,
                link_forum: "https://mycitygre.000webhostapp.com/Dio-Tools/index.html",
                link_contact: "https://mycitygre.000webhostapp.com/Dio-Tools/index.html",
                link_Excel: "https://docs.zoho.com/file/5y2lva773ddcde22f4ebc8febadec843aaceb",
                forum: "Δικαστήριο",
                author: "Συγγραφέας",
                Feature: "νέο χαρακτηριστικό",
                cat_units: "μονάδες",
                cat_icons: "Εικόνες στις πόλεις",
                cat_forum: "Δικαστήριο",
                cat_trade: "Εμπορικές συναλλαγές",
                cat_wonders: "WW",
                cat_layout: "σχέδιο",
                cat_other: "Οι υπολοιποι",
                cat_moi: "Πρόσθετος",
                cat_nova: "Ασφάλιστρο",
                cat_them: "🎨"
            },
            options: {
                Blue: 'Μπλε',
                Red: 'Το κόκκινο',
                Purple: 'Βιολέτα',
                Yellow: 'Κίτρινος',
                Pink: 'Τριαντάφυλλο',
                Halloween: 'Halloween',
                Christmas: 'Χριστούγεννα',
                Dead: 'Τρύπα',
                Abes: 'Abes',
                Groot: 'Groot',
                themco: 'Τα χρωματιστά',
                themgif: 'Τα κινούμενα',
                test: ["Ενεργοποίηση/Απενεργοποίηση της λίστας χρωματισμένων θεμάτων ", "Επιλέξτε οποιοδήποτε από τα διαθέσιμα θέματα, (Θέματα χρώματος)."],
                ava: ["Επισκόπηση των μονάδων", "Υποδεικνύει τις μονάδες όλων των πόλεων"],
                sml: ["smilies	", "Επεκτείνει το BBCode με ένα smiley κουτί"],
                str: ["Αντοχή Στρατεύματα", "Προσθέτει δύναμη πλαίσια στρατεύματα σε αρκετές περιοχές"],
                tra: ["μεταφορική ικανότητα", "Δείχνει την πολυσύχναστη ικανότητα μεταφοράς και διαθέσιμες στο μενού οδήγησης"],
                per: ["εμπορίου ποσοστό", "Επεκτείνει το παράθυρο του εμπορίου με ποσοστό συναλλαγών"],
                rec: ["Εμπορίου για την πρόσληψη", "Επεκτείνει το παράθυρο εμπόριο με το εμπόριο προσλήψεις"],
                cnt: ["Μετρητής κίνησης", "επιθέσεις Μετρητής / υποστήριξης στο παράθυρο επίτευξη"],
                way: ["Στρατιωτική ταχύτητας", "Εμφανίζει δείχνουν την πιθανή ταχύτητα στρατευμάτων στο παράθυρο επίθεση / ενίσχυση"],
                sim: ["Προσομοιωτής", "Προσαρμογή της διάταξης προσομοιωτή και μόνιμη έκθεση του επεκτάθηκε κουτί αρμοδιότητες"],
                spl: ["Μετρητά Θεϊκές Δυνάμεις", "Μικρές & κινητό μαγνητικό κουτί θεϊκές δυνάμεις (με μνήμη θέσης)"],
                pop: ["θείας χάρες κουτί", "Αλλάζει η θεία ευνοεί κουτί με μια νέα διάταξη"],
                tsk: ["γραμμή εργασιών", "Αυξάνει τη γραμμή εργασιών και ελαχιστοποιεί τις καθημερινές παράθυρο ανταμοιβή στην αρχή"],
                for: ["μορφή Excel", "μορφή Excel για Siege"],
                bbc: ["Υποστήριξη εφαρμογής", "Επεκτείνει μπαρ BBCode με έναν τρόπο για να ζητήσουν υποστήριξη Αυτόματη"],
                com: ["σύγκριση μονάδες", "Προσθέστε πίνακες σύγκρισης κίνησης	"],
                tic: ["Εικόνες στις πόλεις", "Κάθε πόλη δέχεται ένα εικονίδιο για τον τύπο των στρατευμάτων στην πόλη (αυτόματη ανίχνευση)", "επιπλέον εικονίδια είναι διαθέσιμα για χειροκίνητη επιλογή"],
                til: ["Κατάλογος των Πόλεων", "Προσθέτει εικόνες της πόλης στον κατάλογο των πόλεων"],
                tim: ["Χάρτης", "Εμφανίζει εικονίδια των πόλεων στο στρατηγικό χάρτη"],
                wwc: ["Υπολογιστής WW", "Και υπολογισμός κοινόχρηστο μετρητή πόρο + προηγούμενο και επόμενο κουμπιά θαύματα του κόσμου (προς το παρόν δεν απενεργοποιούνται!)"],
                wwr: ["Ταξινόμηση", "Η κατάταξη των θαύμα του κόσμου επανασχεδιασμένο"],
                wwi: ["εικονίδια", "Προσθέτει εικονίδια στο θαύμα του κόσμου στο στρατηγικό χάρτη"],
                con: ["Κατάλογος συμφραζόμενων", "Ανταλλαγή Επιλέξτε πόλη και επισκόπηση των πόλεων στο μενού περιβάλλοντος"],
                sen: ["Εστάλη μονάδες", "Εμφανίζει τις μονάδες που αποστέλλονται στο παράθυρο επίθεση / ενίσχυση"],
                tov: ["Θέα της πόλης", "Αντικαθιστά το νέο πανόραμα της πόλης με το ύφος του παλιού παραθύρου"],
                scr: ["Mouse Wheel", "Αλλαγές με Moleta το ποντίκι, το όραμα Island / Χάρτης"],
                stt: ["statistiques Grepodata", "Προσθέτει ένα κουμπί για να δείτε το στατικό κόσμο"],
                err: ["Αυτόματη αποστολή αναφορών σφαλμάτων", "Αν ενεργοποιήσετε αυτή την επιλογή, μπορείτε να βοηθήσει στον εντοπισμό σφαλμάτων."],
                Tti: ["Εμπόριο πόρους για τα φεστιβάλ", "Κάντε κλικ για να στείλετε πόρους σε ένα φεστιβάλ"],
                Isl: ["Island View", "Αυξήστε το ύψος της λίστας των πόλεων και των πόλεων."],
                Ish: ["Πόροι από τα χωριά (ενεργό Καπετάν)", "(Συγκεντρώσει όλα recussos τα νησιά σε 1 κλικ)"],
                Exi: ["	παίτηση:", "💰 Ενεργοποίηση ->"],
                OCC: ["Ocean Αριθμός", "Visualisa Ocean numero"],
                BBV: ["Πόλη σε BB-Code", "Προσθέτει την τρέχουσα πόλη BBcodigo"],
                CVW: ["Κουμπί Πόλη / Χάρτης", "Προσθέτει ένα κουμπί για εναλλαγή μεταξύ του οράματος και χάρτη της πόλης."],
                Mess: ["σε ευχαριστώ για την εμπιστοσύνη σου", "Κάντε διαθέσιμες νέες ενότητες για falicidar καθημερινή σας καθήκοντα στο παιχνίδι, δοκιμαστεί και εγκριθεί.!."],
                Ciw: ["Προβολή της πόλης / παράθυρο", "Εμφάνιση θέα της πόλης σε ένα παράθυρο"],
                act: ["Ενεργοποίηση αναπτυσσόμενα πλαίσια Εμπόριο και την επίθεση", "Βελτιώσεις οθόνη εμπόριο κουτιά και τις προσλήψεις (με μνήμη θέσης)"],
                Bjc: ["Κουμπί BB-code", "Προσθέτοντας ένα κουμπί BBcode (παίκτη και συμμαχίας)"],
                SUA: ["Προσθέστε (χωρίς υπερφόρτωση / Reset)", "Νέα εργαλεία στην επίθεση και το παράθυρο υποστήριξης."],
                Mse: ["menssagens BB-Code", "Μετατρέπει menssagens σε BB-Code"],
                Cul: ["	Επισκόπηση του πολιτισμού (Διαχειριστής)", "Προσθέτει μια καταμέτρηση του συνόλου των παρελάσεων"],
                Hid: ["	Προσθήκη στο σπήλαιο", "Προσθέτει ασήμι στο σπήλαιο στην αποθήκη έχουν πάνω από 15K.	"],
                Hio: ["	Προβολή των σπηλαίων (Διαχειριστής)	", "5 κατηγορίες διαθέσιμη αναζήτησης.	"],
                ubv: ["	του πληθυσμού της ικανότητας", "υποστηρίξει την ικανότητα - από το νησί	"],
                her: ["κατάκτηση Θρακικό", "χάρτης μείωση του μεγέθους Θρακικό επίτευγμα."]
            },
            Quack: {
                cityfestivals: "Urban Festival",
                olympicgames: "Ολυμπιακοί αγώνες",
                triumph: "νίκη Parade",
                theater: "θεατρικές παραστάσεις"
            },
            labels: {
                stt: "statistiques Grepodata",
                uni: "Επισκόπηση των μονάδων",
                total: "Παγκόσμια",
                available: "Διαθέσιμος",
                outer: "Εξω",
                con: "Επιλέξτε πόλη",
                no_overload: "χωρίς υπερφόρτωση",
                std: "Πρότυπο",
                gre: "Grepolis",
                nat: "Φυσικός",
                ppl: "Δημοφιλής",
                oth: "Οι υπολοιποι",
                hal: "	Απόκριες",
                xma: "Χιστούγεννα",
                ttl: "Υποστήριξη εφαρμογής",
                inf: "Πόλη πληροφορίες:",
                dev: "ακρίβεια",
                det: "Λεπτομερής μονάδες",
                prm: "μπόνους Premium",
                sil: "Ασημένιο στο Grotto",
                mov: "Κινήσεις στην πόλη:",
                WaUp: "Τείχος<25",
                Rev2: "φλόγα R2",
                Def1: "άμυνας Terre",
                Bir1: "άμυνας Birremes",
                OC: "OC	",
                R2: "R2 Top:",
                FR2: " Τέλος R2: ",
                f_R212: "Εξέγερση 12Η",
                f_R210: "Εξέγερση 10Η",
                NTS: "Μονάδες χωρίς λεπτομέρειες",
                fooster: "👆 / 👇 ή τίποτα",
                leg: "WW Θαύματα",
                stg: "Επίπεδο",
                tot: "Σύνολο",
                str: "Ισχύς Μονάδων",
                los: "απώλειες",
                mod: "Δεν τροποποίησης επιρροή",
                dsc: "μονάδες σύγκριση",
                hck: "Επίπτωση",
                prc: "Τομή",
                dst: "Arremço",
                sea: "Ναυτικός",
                att: "Προσβλητικός",
                def: "Αμυντικός",
                spd: "ταχύτητα",
                bty: "Λεία (πόροι)",
                cap: "Δυνατότητα μεταφοράς",
                res: "Κόστος (πόροι)",
                fav: "εύνοια	",
                tim: "Χρόνος Πρόσληψη (s)",
                BBV: "BB-Code Πόλη",
                rat: "αναλογία Resource ενός τύπου μονάδας",
                shr: "Από την αποθήκη στην πόλη προορισμού",
                per: "εμπορίου ποσοστό	",
                lab: "μονάδες αποσταλεί",
                cityfestivals: "Αστική φεστιβάλ",
                improved_movement: "στρατεύματα οδηγείτε με ρύθμιση μπόνους	",
                cap_of_invisibility: "Ώρα αόρατου, Ώρα του τέλους του ξόρκι"
            },
            messages: {
                export: "Μήνυμα Μετατροπή σε BB-Code",
                Tol: "Copiar e colar",
                copy: "αντίγραφο",
                bbmessages: "μηνύματα BB-Code",
                copybb: "BB-Code αντιγράφηκε",
            },
            grepo_mainmenu: {
                city_view: "Θέα της πόλης",
                island_view: "Προβολή του νησιού"
            },
            buttons: {
                sav: "Να σώσω",
                ins: "Εισάγετε",
                res: "Επαναφορά"
            }
        },
        ////////////////////////////////////////////////
       //  Néerlandais (NL) Translation by  JoeMan   //
      ////////////////////////////////////////////////
        dk: {
            link: {
                Update: "https://mycitygre.000webhostapp.com/Dio-Tools/Dio_tools/changelog-en/index.html",
                contact: "http://grepotemas.blogspot.com/",
                forum: "https://mycitygre.000webhostapp.com/Dio-Tools/index.html",
                UnitComparison: "https://wiki.en.grepolis.com/wiki/Units_Portal/"
            },
            settings: {
                dsc: "Gatinho biedt, onder andere, sommige schermen, een smiley box, handel in opties<br> en een aantal wijzigingen in de lay-out.",
                prv: "Een voorbeeld van een aantal functies:",
                act: "Inschakelen / uitschakelen van de toolkit is voorzien van:",
                version_old: "Versie wordt niet bijgewerkt",
                version_new: "Versie wordt bijgewerkt",
                version_dev: "developer versie",
                version_update: "bijwerken",
                cat_wonders: "WW",
                Update: "Huidige versie V" + version,
                link_forum: "https://mycitygre.000webhostapp.com/Dio-Tools/index.html",
                link_contact: "https://mycitygre.000webhostapp.com/Dio-Tools/index.html",
                link_Excel: "https://docs.zoho.com/file/5y2lva773ddcde22f4ebc8febadec843aaceb",
                forum: "Forum",
                author: "Schrijver",
                Feature: "Nieuwe functie",
                cat_units: "eenheden",
                cat_icons: "Iconen in de steden",
                cat_forum: "Forum",
                cat_trade: "Handel",
                cat_wonders: "WW",
                cat_layout: "lay-out",
                cat_other: "anderen",
                cat_moi: "Extra",
                cat_nova: "Premie",
                cat_them: "🎨"
            },
            options: {
                Blue: 'Blauw',
                Red: 'Rood',
                Purple: 'Paars',
                Yellow: 'Geel',
                Pink: 'Roos',
                Halloween: 'Halloween',
                Christmas: 'Kerstmis',
                Dead: 'Gat',
                Abes: 'Abes',
                Groot: 'Groot',
                themco: 'De gekleurde',
                themgif: 'De geanimeerde',
                test: ["Schakel de lijst met gekleurde thema's in/uit ", "Selecteer een van de beschikbare thema's, (Kleurthema's)."],
                ava: ["Overzicht van de eenheden", "Geeft de eenheden van alle steden"],
                sml: ["smilies", "Breidt de bbcode met een lachend doos"],
                str: ["Sterkte van Troepen", "Voegt macht frames troepen in verschillende gebieden"],
                tra: ["Transportcapaciteit", "Toont de drukke transportcapaciteit en in het menu aandrijving"],
                per: ["tradepercentage", "Breidt het raam handel met een tradepercentage"],
                rec: ["Commerce voor de aanwerving", "Breidt het raam handel met een recruitment handel"],
                cnt: ["Counter motion", "Tegenaanvallen / support in het bereiken venster"],
                way: ["militaire Speed", "Displays geven de mogelijke troep snelheid in de aanval venster / support"],
                sim: ["Simulator", "Aanpassing van de simulator layout en permanente tentoonstelling van de uitgebreide bevoegdheden doos"],
                spl: ["Cash Divine Powers", "Kleine en beweegbare magnetische box goddelijke krachten (met standgeheugen)"],
                pop: ["goddelijke gunsten box", "Verandert de goddelijke gunsten doos met een nieuwe lay-out"],
                tsk: ["taakbalk", "Verhoogt de taakbalk en minimaliseert de dagelijkse beloning raam aan het begin"],
                for: ["formulier Excel", "Excel formulier voor Siege"],
                bbc: ["Application Support", "Breidt bbcode bar met een manier om ondersteuning Automatic vragen"],
                com: ["eenheden vergelijking", "Voeg rijden vergelijkingstabellen"],
                tic: ["Iconen in de steden", "Elke stad krijgt een icoon voor het type troepen in de stad (automatisch)", "extra iconen zijn beschikbaar voor handmatige selectie"],
                til: ["Lijst van Steden", "Voegt iconen van de stad in de lijst van steden"],
                tim: ["Kaart", "Shows iconen van steden op de strategische kaart"],
                wwc: ["WW Calculator", "& Gedeelde berekening teller resource + vorige en volgende knoppen wonderen van de wereld (op dit moment niet uitgeschakeld!)"],
                wwr: ["Classificatie", "Indeling van het wonder van de wereld herontworpen"],
                wwi: ["pictogrammen", "Voegt pictogrammen in het wonder van de wereld in de strategische kaart"],
                con: ["context Menu", "Exchange Selecteer stad en overzicht van steden in het contextmenu"],
                sen: ["verzonden units", "Shows eenheden verzonden in de aanval / support window"],
                tov: ["Uitzicht op de stad", "Vervangt de nieuwe panorama van de stad met de stijl van het oude venster"],
                scr: ["Muis wiel", "Wijzigingen met Moleta muis, visie Island / kaart"],
                stt: ["statistiques Grepodata", "Voegt een knop om de statische wereld te zien"],
                err: ["Automatisch verzenden van foutmeldingen", "Als u deze optie inschakelt, kunt u helpen bij het identificeren van fouten."],
                Tti: ["Handel bronnen voor festivals", "Klik hier om de middelen te sturen naar een festival"],
                Isl: ["Island View", "Verhoging van de hoogte van de lijst van steden en dorpen."],
                Ish: ["Middelen van de dorpen (actieve Captain)", "(Verzamel alle recussos de eilanden in 1 klik)"],
                Exi: ["eis:", "💰  Activeren ->"],
                OCC: ["Ocean Aantal", "Visualisa Ocean numero"],
                BBV: ["City in de BB-code", "Voegt de huidige stad BBcodigo"],
                CVW: ["Button Stad / kaart", "Voegt een knop om te schakelen tussen de visie en de stadsplattegrond."],
                Mess: ["bedankt voor je vertrouwen", "Beschikbaar stellen van nieuwe modules voor falicidar uw dagelijkse taken in het spel, getest en goedgekeurd.!."],
                Ciw: ["Bekijk van de stad / raam", "Laat uitzicht op de stad in een venster"],
                act: ["Enable drop-down boxen en Commercial aanval", "weergaveverbetering handel dozen en rekrutering (met de positie geheugen)"],
                Bjc: ["Button BB-code", "Het toevoegen van een knop BBcode (speler en de alliantie)"],
                SUA: ["Voeg (No Overload / Reset)", "Nieuwe instrumenten in de aanval en ondersteuning venster."],
                Mse: ["BB-code menssagens", "Bekeerlingen menssagens in BB-code"],
                Cul: ["Overzicht van de cultuur (Administrator)", "Voegt een telling van alle parades"],
                Hid: ["	Voeg toe aan grot", "Voegt zilver naar de grot in het magazijn hebben meer dan 15K."],
                Hio: ["	Uitzicht op de grotten (Administrator)", "5 categorieën beschikbaar zoeken."],
                ubv: ["	capaciteit bevolking", "ondersteunen capaciteit - van het eiland"],
                her: ["verovering Thracische", "kaart verkleinen Thracische prestatie."]
            },
            Quack: {
                cityfestivals: "Urban Festival",
                olympicgames: "Olympische Spelen",
                triumph: "Victory Parade",
                theater: "theatervoorstellingen"
            },
            labels: {
                stt: "statistiques Grepodata",
                uni: "Overzicht van de eenheden",
                total: "Globaal",
                available: "Beschikbaar",
                outer: "Uit",
                con: "selecteer stad",
                no_overload: "zonder overbelasting",
                std: "Standaard",
                gre: "Grepolis",
                nat: "natuurlijk",
                ppl: "Populair",
                oth: "anderen",
                hal: "Halloween",
                xma: "Kerstmis-",
                ttl: "Application Support",
                inf: "Stad info:",
                dev: "precisie",
                det: "gedetailleerde units",
                prm: "bonus Premium",
                sil: "Silver bij de Grot",
                mov: "Het verloop van de stad:",
                WaUp: "Muur<25",
                Rev2: "R2 flame",
                Def1: "verdediging Terre",
                Bir1: "verdediging Birremes",
                OC: "OC",
                R2: "R2 Top:",
                FR2: " Einde R2: ",
                f_R212: "Opstand 12H",
                f_R210: "Opstand 10H",
                NTS: "Eenheden zonder details",
                fooster: "👆 / 👇 of niets",
                leg: "WW Wonders",
                stg: "Niveau",
                tot: "Totaal",
                str: "Power Units",
                los: "Verliezen",
                mod: "Geen modifier invloed",
                dsc: "vergelijking units",
                hck: "Gevolg",
                prc: "Besnoeiing",
                dst: "Arremço",
                sea: "marine-",
                att: "Aanvallend",
                def: "defensief",
                spd: "snelheid",
                bty: "Booty (middelen)",
                cap: "De mogelijkheid om het vervoer",
                res: "Kosten (middelen)",
                fav: "gunst",
                tim: "Time Recruitment (s)",
                BBV: "BB-code Stad",
                rat: "Bron verhouding van diverse eenheden",
                shr: "Vanuit de opslag op de plaats van bestemming",
                per: "tradepercentage",
                lab: "verzonden units",
                cityfestivals: "Urban festivals",
                improved_movement: "troepen rijden met bonus aanpassing",
                cap_of_invisibility: "Tempo de invisibilidade, Hora de término do efeito"
            },
            messages: {
                export: "Convert bericht naar BB-code",
                Tol: 'Copiar e colar',
                copy: "Kopiëren",
                bbmessages: "BB-code berichten",
                copybb: "BB-code is gekopieerd",
            },
            grepo_mainmenu: {
                city_view: "Uitzicht op de stad",
                island_view: "Gezicht op het eiland"
            },
            buttons: {
                sav: "Opslaan",
                ins: "invoegen",
                res: "Reset"
            }
        },
        ///////////////////////////////////////////
       //  English (EN) Translation by  JoeMan  //
      ///////////////////////////////////////////
        en: {
            link: {
                Update: "https://mycitygre.000webhostapp.com/Dio-Tools/Dio_tools/changelog-en/index.html",
                contact: "http://grepotemas.blogspot.com/",
                forum: "https://mycitygre.000webhostapp.com/Dio-Tools/index.html",
                UnitComparison: "https://wiki.en.grepolis.com/wiki/Units_Portal/"
            },
            settings: {
                dsc: "Gatinho offers, among other things, some screens, one smiley box, options trading<br> and some changes in the layout.",
                prv: "Preview several features:",
                act: "Enable / disable the toolkit features:",
                version_old: "Version is not updated",
                version_new: "Version is updated",
                version_dev: "developer version",
                version_update: "update",
                cat_wonders: "WW",
                Update: "Current version V" + version,
                link_forum: "https://mycitygre.000webhostapp.com/Dio-Tools/index.html",
                link_contact: "https://mycitygre.000webhostapp.com/Dio-Tools/index.html",
                link_Excel: "https://docs.zoho.com/file/5y2lva773ddcde22f4ebc8febadec843aaceb",
                forum: "Forum",
                author: "Author",
                Feature: "New Feature",
                cat_units: "Units",
                cat_icons: "Icons in the Cities",
                cat_forum: "Forum",
                cat_trade: "Trade",
                cat_wonders: "WW",
                cat_layout: "layout",
                cat_other: "Others",
                cat_moi: "Additional",
                cat_nova: "Premium",
                cat_them: "🎨"
            },
            options: {
                Blue: 'Blue',
                Red: 'Red',
                Purple: 'Violet',
                Yellow: 'Yellow',
                Pink: 'Pink',
                Halloween: 'Halloween',
                Christmas: 'Christmas',
                Dead: 'Hole',
                Abes: 'Abes',
                Groot: 'Groot',
                themco: 'The colored ones',
                themgif: 'The animated ones',
                test: ["AEnable/Disable the list of colored themes ", "Select any of the available themes, (Color Themes)."],
                ava: ["Overview of units", "Indicates the units of all cities"],
                sml: ["smilies", "Extends the bbcode with a smiley box"],
                str: ["Strength of Troops", "Adds power frames troops in several areas"],
                tra: ["Transport capacity", "Shows the busy transport capacity and available in the drive menu"],
                per: ["trade percentage", "Extends the trade window with a trade percentage"],
                rec: ["Commerce for recruitment", "Extends the trade window with a recruitment trade"],
                cnt: ["Counter motion", "Counter attacks / support in the achievement window"],
                way: ["Military Speed", "Displays show the possible troop speed in the attack window / support"],
                sim: ["Simulator", "Adaptation of the simulator layout & permanent exhibition of the extended powers box"],
                spl: ["Cash Divine Powers", "Small & movable magnetic box divine powers (with position memory)"],
                pop: ["divine favors box", "Changes the divine favors box with a new layout"],
                tsk: ["taskbar", "Increases the taskbar and minimizes daily reward window at the beginning"],
                for: ["form Excel", "Excel form for Siege"],
                bbc: ["Application Support", "Extends bbcode bar with a way to request Support Automatic"],
                com: ["Units comparison", "Add drive comparison tables"],
                tic: ["Icons in the Cities", "Each city receives an icon for the type of troops in the city (automatic detection)", "additional icons are available for manual selection"],
                til: ["List of Cities", "Adds the city's icons in the list of cities"],
                tim: ["Map", "Shows icons of cities on the strategic map"],
                wwc: ["WW Calculator", "& shared counter resource calculation + previous and next buttons wonders of the world (currently not deactivated!)"],
                wwr: ["Classification", "Classification of the wonder of the world redesigned"],
                wwi: ["icons", "Adds icons in the wonder of the world in the strategic map"],
                con: ["Context Menu", "Exchange Select city and Overview of Cities in the context menu"],
                sen: ["Sent units", "Shows units sent in the attack / support window"],
                tov: ["City view", "Replaces the new panorama of the city with the style of the old window"],
                scr: ["Mouse Wheel", "Changes with moleta mouse, vision Island / Map"],
                stt: ["statistiques Grepodata", "Adds a button to see the static world"],
                err: ["Automatically send error reports", "If you enable this option, you can help identify errors."],
                Tti: ["Trade resources for festivals", "Click to send resources to a festival"],
                Isl: ["Island View", "Increase the height of the list of cities and towns."],
                Ish: ["Resources of the villages (active Captain)", "(Collect all recussos the islands in 1 click)"],
                Exi: ["Requirement:", "💰  Activate ->"],
                OCC: ["Ocean Number", "Visualisa Ocean numero"],
                BBV: ["City in BB-Code", "Adds the current city BBcodigo"],
                CVW: ["Button City / Map", "Adds a button to switch between the vision and the city map."],
                Mess: ["thank you for your trust", "Make available new modules for falicidar your day to day tasks in the game, tested and approved.!."],
                Ciw: ["View of the city / window", "Show views of the city in a window"],
                act: ["Enable drop-down boxes and Commercial attack", "display enhancements trade boxes and recruitment (with position memory)"],
                Bjc: ["Button BB-code", "Adding a button BBcode (player and alliance)"],
                SUA: ["Add (No Overload / Reset)", "New tools in attack and support window."],
                Mse: ["BB-Code menssagens", "Converts menssagens in BB-Code"],
                Cul: ["Overview of culture (Administrator)", "Adds a count of all the parades"],
                Hid: ["	Add to cave	", "Adds silver to the cave in the warehouse have over 15K."],
                Hio: ["	View of the caves (Administrator)", "5 categories available search."],
                ubv: ["	capacity population	", "support capacity - off the island"],
                her: ["conquest Thracian", "map size reduction Thracian achievement."]
            },
            Quack: {
                cityfestivals: "Urban Festival",
                olympicgames: "Olympic Games",
                triumph: "Victory Parade",
                theater: "Theater performances"
            },
            labels: {
                stt: "statistiques Grepodata",
                uni: "Overview of units",
                total: "Global",
                available: "Available",
                outer: "Out",
                con: "select city",
                no_overload: "without overload",
                std: "Standard",
                gre: "Grepolis",
                nat: "Natural",
                ppl: "Popular",
                oth: "Others",
                hal: "Halloween",
                xma: "Christmas",
                ttl: "Application Support",
                inf: "City info:",
                dev: "precision",
                det: "Detailed units",
                prm: "bonus Premium",
                sil: "Silver at the Grotto",
                mov: "Movements in the city:",
                WaUp: "Wall<25",
                Rev2: "Flame R2",
                Def1: "defense Terre",
                Bir1: "defense Birremes",
                OC: "OC",
                R2: "R2 Top:",
                FR2: " End R2: ",
                f_R212: "Uprising 12H",
                f_R210: "Uprising 10H",
                NTS: "Units without Details",
                fooster: "👆 / 👇 or nothing",
                leg: "WW Wonders",
                stg: "Level",
                tot: "Total",
                str: "Power Units",
                los: "Losses",
                mod: "No modifier influence",
                dsc: "Comparison units",
                hck: "Impact",
                prc: "Cut",
                dst: "Arremço",
                sea: "Naval",
                att: "Offensive",
                def: "Defensive",
                spd: "velocity",
                bty: "Booty (resources)",
                cap: "Ability to transport",
                res: "Cost (resources)",
                fav: "favor",
                tim: "Time Recruitment (s)",
                BBV: "BB-Code City",
                rat: "Resource ratio of one type of unit",
                shr: "From the storage on the destination city",
                per: "trade percentage",
                lab: "sent units",
                cityfestivals: "Urban festivals",
                improved_movement: "troops drive with bonus adjustment",
                cap_of_invisibility: "Time of invisibility, End time of the effect"
            },
            messages: {
                export: "Convert message to BB-Code",
                Tol: "Copy and paste",
                copy: "Copy",
                bbmessages: "BB-Code messages",
                copybb: "BB-Code was copied",
            },
            grepo_mainmenu: {
                city_view: "City view",
                island_view: "View of the Island"
            },
            buttons: {
                sav: "To save",
                ins: "Insert",
                res: "Reset"
            }
        },
        ///////////////////////////////////////////////////
       //      French (FR) Translation by JoeMan        //
      ///////////////////////////////////////////////////
        fr: {
            link: {
                Update: "https://mycitygre.000webhostapp.com/Dio-Tools/Dio_tools/changelog-en/index.html",
                contact: "http://grepotemas.blogspot.com/",
                forum: "https://mycitygre.000webhostapp.com/Dio-Tools/index.html",
                UnitComparison: "https://wiki.en.grepolis.com/wiki/Units_Portal/"
            },
            settings: {
                dsc: "offres JOE-outils, entre autres, certains écrans, une boîte de smiley, la négociation d'options<br> et quelques changements dans la mise en page.",
                prv: "Aperçu de plusieurs caractéristiques:",
                act: "Activer / désactiver la boîte à outils comprend:",
                version_old: "Version est pas mis à jour",
                version_new: "Version mise à jour",
                version_dev: "version développeur",
                version_update: "mise à jour",
                cat_wonders: "WW",
                Update: "Version actuelle V" + version,
                link_forum: "https://mycitygre.000webhostapp.com/Dio-Tools/index.html",
                link_contact: "https://mycitygre.000webhostapp.com/Dio-Tools/index.html",
                link_Excel: "https://docs.zoho.com/file/5y2lva773ddcde22f4ebc8febadec843aaceb",
                forum: "Forum",
                author: "Auteur",
                Feature: "Nouvelle fonctionnalité",
                cat_units: "Unités",
                cat_icons: "Icônes dans les villes",
                cat_forum: "Forum",
                cat_trade: "Commerce",
                cat_wonders: "WW",
                cat_layout: "disposition",
                cat_other: "Autres",
                cat_moi: "Additionnel",
                cat_nova: "Prime",
                cat_them: "🎨"
            },
            options: {
                Blue: 'Bleu',
                Red: 'Rouge',
                Purple: 'Violet',
                Yellow: 'Jaune',
                Pink: 'Rose',
                Halloween: 'Halloween',
                Christmas: 'Noël',
                Dead: 'trou',
                Abes: 'Abes',
                Groot: 'Groot',
                themco: 'Les colorés',
                themgif: 'Les animés',
                test: ["Activer/Désactiver la liste des thèmes colorés ", "Sélectionnez l'un des thèmes disponibles (Thèmes de couleur)."],
                ava: ["Vue d'ensemble des unités", "Indique les unités de toutes les villes"],
                sml: ["smileys", "Prolonge le BBcode avec une boîte smiley"],
                str: ["Force des troupes", "Ajoute cadres électriques des troupes dans plusieurs domaines"],
                tra: ["capacité de transport", "Montre la capacité de transport occupés et disponible dans le menu du lecteur"],
                per: ["pourcentage du commerce", "Prolonge la fenêtre du commerce avec un pourcentage de commerce"],
                rec: ["Commerce pour le recrutement", "Prolonge la fenêtre commerciale avec un commerce de recrutement"],
                cnt: ["compteur de mouvement", "contre-attaques / support dans la fenêtre de réalisation"],
                way: ["Vitesse militaire", "Displays la vitesse de troupes possible dans la fenêtre d'attaque / support"],
                sim: ["Simulateur", "Adaptation de la mise en page de simulation et exposition permanente de la boîte de pouvoirs étendus"],
                spl: ["Pouvoirs divins en espèces", "Petits et boîte magnétique mobiles pouvoirs divins (avec mémoire de position)"],
                pop: ["boîte faveurs divines", "Modifie les faveurs divines boîte avec une nouvelle mise en page"],
                tsk: ["barre des tâches", "Augmente la barre des tâches et réduit la fenêtre de récompense par jour au début"],
                for: ["formulaire Excel", "forme Excel pour siège"],
                bbc: ["Support d'application", "Ajout d'un bouton dans la barre BBCode pour un formulaire de défense automatique"],
                com: ["comparaison des unités", "Ajouter des tables de comparaison d'entraînement"],
                tic: ["Icônes dans les villes", "Chaque ville reçoit une icône pour le type de troupes dans la ville (détection automatique)", "icônes supplémentaires sont disponibles pour la sélection manuelle"],
                til: ["Liste des villes", "Ajoute les icônes de la ville dans la liste des villes"],
                tim: ["Carte", "icônes Spectacles des villes sur la carte stratégique"],
                wwc: ["WW Calculator", "Et calcul compteur de ressources partagées + boutons précédent et suivant merveilles du monde (actuellement pas désactivé!)"],
                wwr: ["Classification", "Classification de la merveille du monde redessinée"],
                wwi: ["Icônes", "Ajoute des icônes dans la merveille du monde sur la carte stratégique"],
                con: ["Menu contextuel", "Echange Sélectionnez la ville et Vue d'ensemble des villes dans le menu contextuel"],
                sen: ["unités envoyées", "unités de Spectacles envoyés dans l'attaque / fenêtre de soutien"],
                tov: ["Vue de la ville", "Remplace le nouveau panorama de la ville avec le style de l'ancienne fenêtre"],
                scr: ["Roulette de la souris", "Les changements avec la souris moleta, vision Island / Carte"],
                stt: ["Grepodata Statistiques", "Ajoute un bouton pour voir le monde statique"],
                err: ["envoyer automatiquement des rapports d'erreur", "Si vous activez cette option, vous pouvez aider à identifier les erreurs."],
                Tti: ["Ressources commerciales pour les festivals", "Cliquez ici pour envoyer des ressources à un festival"],
                Isl: ["Island View", "Augmenter la hauteur de la liste des villes et villages."],
                Ish: ["Les ressources des villages (capitaine actif)", "(Collectez toutes les îles recussos en 1 clic)"],
                Exi: ["Exigence:", "💰  Activer ->"],
                OCC: ["Ocean Nombre", "Visualisa Ocean Nombre"],
                BBV: ["Ville en BB-Code", "Ajoute la ville actuelle BBcodigo"],
                CVW: ["Bouton Ville / Carte", "Ajoute un bouton pour basculer entre la vision et la carte de la ville."],
                Mess: ["Merci pour ta confiance", "Faire de nouveaux modules disponibles pour falicidar journée tâches quotidiennes dans le jeu, testé et approuvé.!."],
                Ciw: ["Vue de la ville / fenêtre", "Afficher les vues de la ville dans une fenêtre"],
                act: ["Activer boîtes déroulantes et attaque commerciale", "améliorer l'affichage et le commerce des boîtes de recrutement (avec mémoire de position)"],
                Bjc: ["Bouton BB code", "Ajout d'un bouton BBcode (joueur et alliance)"],
                SUA: ["Ajouter (Pas de surcharge / Reset)", "De nouveaux outils dans l'attaque et la fenêtre de soutien."],
                Mse: ["BB-code menssagens", "Menssagens en BB convertis-Code"],
                Cul: ["Vue d'ensemble de la culture (Administrateur)", "Ajoute un compteur de tous les défilés"],
                Hid: ["	Ajouter à la grotte	", "Adds d'argent à la grotte dans l'entrepôt ont plus de 15K."],
                Hio: ["	Vue des grottes (Administrateur)", "5 catégories de recherche disponibles."],
                ubv: ["	population des capacités", "capacité de soutenir - de l'île."],
                her: ["conquête thrace", "carte réduction de la taille réalisation thrace."]
            },
            Quack: {
                cityfestivals: "Urban festival",
                olympicgames: "jeux olympiques",
                triumph: "Victory Parade",
                theater: "Des représentations théâtrales"
            },
            labels: {
                stt: "Grepodata Statistiques",
                uni: "Vue d'ensemble des unités",
                total: "Global",
                available: "Disponible",
                outer: "En dehors",
                con: "Sélectionnez une ville",
                no_overload: "sans surcharge",
                std: "la norme",
                gre: "Grepolis",
                nat: "Naturel",
                ppl: "Populaire",
                oth: "Autres",
                hal: "Halloween",
                xma: "Noël",
                ttl: "Support d'application",
                inf: "Renseignements:",
                dev: "précision",
                det: "unités détaillées",
                prm: "Prime bonus",
                sil: "Argent à la Grotte",
                mov: "Mouvements de la ville:",
                WaUp: "mur<25",
                Rev2: "R2 Flame",
                Def1: "Terre défense",
                Bir1: "défense Birremes",
                OC: "OC",
                R2: "R2 Top:",
                FR2: " Fin R2: ",
                f_R212: "Soulèvement 12H",
                f_R210: "Soulèvement 10H",
                NTS: "Unités sans détails",
                fooster: "👆 / 👇 ou rien",
                leg: "WW merveilles",
                stg: "Niveau",
                tot: "Total",
                str: "Unités d'alimentation",
                los: "Pertes",
                mod: "Pas d'influence modificateur",
                dsc: "unités de comparaison",
                hck: "Impact",
                prc: "Couper",
                dst: "Arremço",
                sea: "Naval",
                att: "Offensive",
                def: "Défensive",
                spd: "rapidité",
                bty: "Booty (ressources)",
                cap: "Possibilité de transports",
                res: "Coût (ressources)",
                fav: "favoriser",
                tim: "Temps recrutement (s)",
                BBV: "Ville BB-Code",
                rat: "rapport de la ressource d'un type d'unité",
                shr: "Depuis le stockage sur la ville de destination",
                per: "pourcentage du commerce",
                lab: "unités ENVOYÉ",
                cityfestivals: "festivals urbains",
                improved_movement: "troupes en voiture avec réglage de bonus",
                cap_of_invisibility: "Temps d'invisibilité, Heure de fin de l'effet"
            },
            messages: {
                export: "Convertir un message à BB-Code",
                Tol: 'Copiar e colar',
                copy: "Copie",
                bbmessages: "messages code BB",
                copybb: "BB-Code a été copié",
            },
            grepo_mainmenu: {
                city_view: "Vue de la ville",
                island_view: "Vue de l'île"
            },
            buttons: {
                sav: "Sauver",
                ins: "Insérer",
                res: "Réinitialiser"
            }
        },
        ///////////////////////////////////////////////////
       //      Russian (RU) Translation by JoeMan       //
      ///////////////////////////////////////////////////
        ru: {
            link: {
                Update: "https://mycitygre.000webhostapp.com/Dio-Tools/Dio_tools/changelog-en/index.html",
                contact: "http://grepotemas.blogspot.com/",
                forum: "https://mycitygre.000webhostapp.com/Dio-Tools/index.html",
                UnitComparison: "https://wiki.en.grepolis.com/wiki/Units_Portal/"
            },
            settings: {
                dsc: "Gatinho предлагает, кроме всего прочего, некоторые экраны, один смайлик коробка, торговли опционами<br> и некоторые изменения в макете.",
                prv: "Предварительный просмотр несколько функций:",
                act: "Включение / выключение инструментарий функции:",
                version_old: "Версия не обновляется",
                version_new: "Версия обновлена",
                version_dev: "версия для разработчиков",
                version_update: "Обновить",
                cat_wonders: "WW",
                Update: "Текущая версия V" + version,
                link_forum: "https://mycitygre.000webhostapp.com/Dio-Tools/index.html",
                link_contact: "https://mycitygre.000webhostapp.com/Dio-Tools/index.html",
                link_Excel: "https://docs.zoho.com/file/5y2lva773ddcde22f4ebc8febadec843aaceb",
                forum: "Форум",
                author: "автор",
                Feature: "Новая особенность",
                cat_units: "Единицы",
                cat_icons: "Иконки в городах",
                cat_forum: "Форум",
                cat_trade: "Сделка",
                cat_wonders: "WW",
                cat_layout: "расположение",
                cat_other: "другие",
                cat_moi: "дополнительный",
                cat_nova: "премия",
                cat_them: "🎨"
            },
            options: {
                Blue: 'Синий',
                Red: 'Красный',
                Purple: 'Фиолетовый',
                Yellow: 'Желтый',
                Pink: 'Роза',
                Halloween: 'Halloween',
                Christmas: 'Рождество',
                Dead: 'Отверстие',
                Abes: 'Abes',
                Groot: 'Groot',
                themco: 'Цветные',
                themgif: 'Анимированные',
                test: ["Включение / отключение списка цветных тем. ", "Выберите любую из доступных тем (Цветовые темы)."],
                ava: ["Обзор блоков", "Указывает единицы всех городов"],
                sml: ["смайлики", "Расширяет с BBCode смайлик коробки"],
                str: ["Прочность войск", "Добавляет мощность кадров войск в нескольких районах"],
                tra: ["Объем транспорта", "Показывает занятую транспортную емкость и доступны в меню диска"],
                per: ["процент торговли", "Расширяет окно торговли с процентом торговли"],
                rec: ["Торговля для набора", "Расширяет окно торговли с торговлей набором"],
                cnt: ["Счетчик движения", "Счетчик атаки / поддержки в окне достижения"],
                way: ["Военно-Speed", "Дисплеи показывают возможную скорость войск в окне атаки / поддержки"],
                sim: ["имитатор", "Адаптация макета имитатора и постоянной экспозиции расширенной коробки полномочий"],
                spl: ["Наличный Divine Powers", "Малые и подвижные магнитное окно божественные силы (с памятью положения)"],
                pop: ["Божественные благосклонности коробки", "Изменения божественные благосклонности коробки с новой компоновкой"],
                tsk: ["Панель задач", "Увеличивает панель задач и минимизирует ежедневные окна вознаграждения в начале"],
                for: ["форма Excel", "Форма Excel для Siege"],
                bbc: ["Поддержка приложения", "Расширяет BBcode бар с образом просить поддержки Automatic"],
                com: ["Сравнение Units", "Добавить таблицы сравнения привода"],
                tic: ["Иконки в городах", "Каждый город получает значок типа войск в городе (автоматическое обнаружение)", "дополнительные иконки доступны для ручного выбора"],
                til: ["Список городов", "Добавляет иконки городов в списке городов"],
                tim: ["карта", "Показывает иконку городов на стратегической карте"],
                wwc: ["WW Calculator", "И расчет общий счетчик ресурсов + предыдущие и последующие кнопки чудес света (в настоящее время не отключается!)"],
                wwr: ["классификация", "Классификация чуда света переработана"],
                wwi: ["иконки", "Добавляет значки в чудо света в стратегической карте"],
                con: ["Контекстное меню", "город Обмен Выбор и обзор городов в контекстном меню"],
                sen: ["Переданные блоки", "Показывает единицы отправлены в / окне поддержки атаки"],
                tov: ["Вид на город", "Заменяет новую панораму города со стилем старого окна"],
                scr: ["Колесико мыши", "Изменения с Moleta мыши, видение острова / Карта"],
                stt: ["Statistiques Grepodata", "Добавляет кнопку, чтобы увидеть статический мир"],
                err: ["Автоматически отправлять отчеты об ошибках", "Если включить эту опцию, вы можете помочь выявить ошибки."],
                Tti: ["Торговые ресурсы для праздников", "Нажмите, чтобы отправить ресурсы на фестиваль"],
                Isl: ["Island View", "Увеличение высоты списка городов и населенных пунктов."],
                Ish: ["Ресурсы сел (активный капитан)", "(Собрать все recussos острова в 1 клик)"],
                Exi: ["Требование:", "💰  Активация ->"],
                OCC: ["Ocean Number", "Numero Visualisa океана"],
                BBV: ["Город в BB-Code", "Добавляет текущий город BBcodigo"],
                CVW: ["Кнопка Город / Карта", "Добавляет кнопку для переключения между видением и картой города."],
                Mess: ["Спасибо за доверие", "Высвободить новые модули для falicidar ваших повседневных задач в игре, протестированы и одобрены.!."],
                Ciw: ["Вид города / окна", "Показать вид на город в окне"],
                act: ["Включить раскрывающиеся коробки и коммерческое нападение", "Усовершенствования дисплея торговли коробки и набора (с памятью положения)"],
                Bjc: ["Кнопка BB-код", "Добавление кнопки BBcode (игрок и союз)"],
                SUA: ["Добавить (без перегрузки / Reset)", "Новые инструменты в атаке и окна поддержки."],
                Mse: ["menssagens BB-код", "Преобразует menssagens в BB-коде"],
                Cul: ["Обзор культуры (Администратор)", "Добавляет количество всех парадов"],
                Hid: ["	Добавить в пещеру", "Добавляет серебро в пещеру на складе имеет более 15K."],
                Hio: ["	Вид из пещеры (Администратор)", "5 доступных категорий поиска."],
                ubv: ["	население емкости", "поддерживать емкость - от острова."],
                her: ["завоевание фракийского", "карта уменьшение размера фракийского достижения."]
            },
            Quack: {
                cityfestivals: "фестиваль Urban",
                olympicgames: "Олимпийские игры",
                triumph: "Парад Победы",
                theater: "Театрализованные представления"
            },
            labels: {
                stt: "Statistiques Grepodata",
                uni: "Обзор блоков",
                total: "Глобальный",
                available: "Имеется в наличии",
                outer: "Из",
                con: "выберите город",
                no_overload: "без перегрузки",
                std: "стандарт",
                gre: "Grepolis",
                nat: "натуральный",
                ppl: "Популярный",
                oth: "другие",
                hal: "Хэллоуин",
                xma: "рождество",
                ttl: "Поддержка приложения",
                inf: "Информация о городе:",
                dev: "точность",
                det: "Подробные единицы",
                prm: "бонус Премиум",
                sil: "Серебро в гроте",
                mov: "Движение в городе:",
                WaUp: "стена<25",
                Rev2: "Пламя R2",
                Def1: "защита Terre",
                Bir1: "защита Birremes",
                OC: "OC",
                R2: "R2 Вверх:",
                FR2: " Конец R2: ",
                f_R212: "Восстание 12ч",
                f_R210: "Восстание 10ч",
                NTS: "Единицы без деталей",
                fooster: "👆 / 👇 или ничего",
                leg: "WW Wonders",
                stg: "уровень",
                tot: "Всего",
                str: "Блоки питания",
                los: "потери",
                mod: "Нет Модификатор влияния",
                dsc: "блоки сравнения",
                hck: "Влияние",
                prc: "Порез",
                dst: "Arremço",
                sea: "флотский",
                att: "Наступление",
                def: "оборонительный",
                spd: "скорость",
                bty: "Booty (ресурсы)",
                cap: "Возможность транспортировки",
                res: "Стоимость (ресурсы)",
                fav: "одолжение",
                tim: "Время Recruitment (s)",
                BBV: "BB-код города",
                rat: "Соотношение ресурсов одного типа блока",
                shr: "Из хранилища на город назначения",
                per: "процент торговли",
                lab: "Sent единиц",
                cityfestivals: "Городские праздники",
                improved_movement: "Войска привод с регулировкой бонусной",
                cap_of_invisibility: "Время невидимости, Время окончания эффекта"
            },
            messages: {
                export: "Преобразовать сообщение BB-Code",
                Tol: "Скопировать и вставить",
                copy: "копия",
                bbmessages: "Сообщения BB-код",
                copybb: "BB-код был скопирован",
            },
            grepo_mainmenu: {
                city_view: "Вид на город",
                island_view: "Вид на остров"
            },
            buttons: {
                sav: "Сохранить",
                ins: "Вставить",
                res: "Сброс"
            }
        },
        ///////////////////////////////////////////////////
       //       Polish (PL) Translation by Joeman       //
      ///////////////////////////////////////////////////
        pl: {
            link: {
                Update: "https://mycitygre.000webhostapp.com/Dio-Tools/Dio_tools/changelog-en/index.html",
                contact: "http://grepotemas.blogspot.com/",
                forum: "https://mycitygre.000webhostapp.com/Dio-Tools/index.html",
                UnitComparison: "https://wiki.en.grepolis.com/wiki/Units_Portal/"
            },
            settings: {
                dsc: "Gatinho oferuje między innymi niektóre ekrany, jeden Smiley pudełko, handel opcje<br> i kilka zmian w układzie.",
                prv: "Podgląd kilka funkcji:",
                act: "Włączanie / wyłączanie Toolkit cechy:",
                version_old: "Wersja nie jest aktualizowana",
                version_new: "Wersja jest aktualizowana",
                version_dev: "wersja deweloper",
                version_update: "aktualizacja",
                cat_wonders: "W W",
                Update: "Obecna wersja V" + version,
                link_forum: "https://mycitygre.000webhostapp.com/Dio-Tools/index.html",
                link_contact: "https://mycitygre.000webhostapp.com/Dio-Tools/index.html",
                link_Excel: "https://docs.zoho.com/file/5y2lva773ddcde22f4ebc8febadec843aaceb",
                forum: "Forum",
                author: "Autor",
                Feature: "Nowa cecha",
                cat_units: "jednostki",
                cat_icons: "Ikony w miastach",
                cat_forum: "Forum",
                cat_trade: "Handel",
                cat_wonders: "W W",
                cat_layout: "układ",
                cat_other: "Pozostałe",
                cat_moi: "Dodatkowy",
                cat_nova: "Premia",
                cat_them: "🎨"
            },
            options: {
                Blue: 'Niebieski',
                Red: 'Czerwony',
                Purple: 'Fioletowy',
                Yellow: 'Żółty',
                Pink: 'Róża',
                Halloween: 'Halloween',
                Christmas: 'Boże Narodzenie',
                Dead: 'Otwór',
                Abes: 'Abes',
                Groot: 'Groot',
                themco: 'Kolorowe',
                themgif: 'Animowane',
                test: ["Włącz/wyłącz listę kolorowych motywów. ", "Wybierz dowolny z dostępnych motywów (Motywy kolorystyczne)."],
                ava: ["Przegląd jednostek", "Wskazuje jednostki wszystkich miast"],
                sml: ["Emotikony", "Rozszerza bbcode z uśmiechniętą oknie"],
                str: ["Siła wojsk", "Dodaje ramki mocy oddziały w kilku obszarach"],
                tra: ["przepustowość", "Pokazuje zajęty zdolności przesyłowych i dostępne w menu napędu"],
                per: ["handel procent", "Rozszerza okno handlu z procentem handlu"],
                rec: ["Handel rekrutacji", "Rozszerza okno handlu z handlu rekrutacji"],
                cnt: ["Licznik ruchu", "kontrataki / wsparcie w oknie osiągnięć"],
                way: ["Prędkość wojskowy", "Wyświetlacze pokazują możliwą prędkość wojsk w oknie atak / wsparcia"],
                sim: ["Symulator", "Dostosowanie układu symulatora i stałą ekspozycją na rozszerzone uprawnienia oknie"],
                spl: ["Gotówka Divine Powers", "Małe i ruchome pole magnetyczne boskie moce (z pamięci położenia)"],
                pop: ["boskich łask box", "Zmienia boskich łask pudełko z nowym wyglądem"],
                tsk: ["pasek zadań", "Zwiększa pasek zadań i minimalizuje okno codziennie nagrody na początku"],
                for: ["Formularz Excel", "Formularz Excel dla Oblężenia"],
                bbc: ["Wsparcie aplikacji", "Rozszerza poprzeczkę BBcode z sposób, aby zażądać obsługuje automatycznego"],
                com: ["porównanie jednostek", "Dodaj tabele porównawcze jazdy"],
                tic: ["Ikony w miastach", "Każde miasto otrzyma ikonę rodzaju wojsk w mieście (automatyczne wykrywanie)", "Dodatkowe ikony są dostępne dla ręcznego wyboru"],
                til: ["Lista miast", "Dodaje ikon miasta na liście miast"],
                tim: ["Mapa", "Pokazuje ikony miast na mapie strategicznej"],
                wwc: ["WW Calculator", "I wspólne obliczanie zasobów licznik + poprzednie i kolejne przyciski cudów świata (obecnie nieaktywne!)"],
                wwr: ["Klasyfikacja", "Klasyfikacja cud świata przeprojektowane"],
                wwi: ["ikony", "Dodaje ikony w cud świata na mapie strategicznej"],
                con: ["Menu kontekstowe", "Wybierz miasto i wymiana Przegląd miast w menu kontekstowym"],
                sen: ["wysłane jednostki", "Pokazuje jednostki wysłane w oknie ataku / obsługa"],
                tov: ["Widok miasta", "Zastępuje nową panoramę miasta ze stylem starym oknie"],
                scr: ["Kółko w myszce", "Zmiany w moleta myszy, wizja Island / mapa"],
                stt: ["Statistiques Grepodata", "Dodaje przycisk, aby zobaczyć świat statycznej"],
                err: ["Automatyczne wysyłanie raportów o błędach", "Jeśli włączysz tę opcję, możesz pomóc zidentyfikować błędy."],
                Tti: ["środki handlowe dla festiwali", "Kliknij, aby wysłać zasobów do festiwalu"],
                Isl: ["island View", "Zwiększyć wysokość listy miast i miasteczek."],
                Ish: ["Zasoby wsiach (aktywny kapitan)", "(Zbierz wszystkie recussos wysp w 1 kliknięcie)"],
                Exi: ["Wymaganie:", "💰  Activate ->"],
                OCC: ["Ilość ocean", "Visualisa Ocean numero"],
                BBV: ["Miasto w BB-Code", "Dodaje obecnego miasta BBcodigo"],
                CVW: ["Przycisk Miasto / mapa", "Dodaje przycisk, aby przełączyć się między wizją i mapy miasta."],
                Mess: ["Dziękuję za twoje zaufanie", "Udostępnienie nowych modułów dla falicidar dnia na dzień zadań w grze, przetestowane i zatwierdzone.!."],
                Ciw: ["Widok z okna / miasta", "Pokaż widok na miasto w oknie"],
                act: ["Włącz pola rozwijanej i atak Komercyjne", "Ulepszenia wyświetlacz handlu pudełka i rekrutację (z pamięci położenia)"],
                Bjc: ["Przycisk BB-code", "Dodanie przycisku BBcode (gracz i alliance)"],
                SUA: ["Dodaj (Brak Przeciążenie / Reset)", "Nowe narzędzia w oknie ataku i wsparcia."],
                Mse: ["BB-Code menssagens", "Konwertuje menssagens w BB-Code"],
                Cul: ["Przegląd kultury (Administrator)", "Dodaje rachubę wszystkie parady"],
                Hid: ["	Dodaj do jaskini", "Dodaje srebrny do jaskini w magazynie mają ponad 15K."],
                Hio: ["	Widok jaskiniach (Administrator)", "5 kategoriach dostępne wyszukiwania."],
                ubv: ["	populacja pojemność	", "wspieranie zdolności - od wyspy	"],
                her: ["podbój tracki", "map rozdrabniania trackiego osiągnięcie."]
            },
            Quack: {
                cityfestivals: "Festiwal miejski",
                olympicgames: "Igrzyska Olimpijskie",
                triumph: "Victory Parade",
                theater: "przedstawienia teatralne"
            },
            labels: {
                stt: "Statistiques Grepodata",
                uni: "Przegląd jednostek",
                total: "Światowy",
                available: "Dostępny",
                outer: "Na zewnątrz",
                con: "Wybierz miasto",
                no_overload: "bez przeciążenia",
                std: "Standard",
                gre: "Grepolis",
                nat: "Naturalny",
                ppl: "Popularny",
                oth: "Pozostałe",
                hal: "Halloween",
                xma: "Boże Narodzenie",
                ttl: "Wsparcie aplikacji",
                inf: "Informacje Miasto:",
                dev: "precyzja",
                det: "Szczegółowe jednostki",
                prm: "premia Premium",
                sil: "Srebro w grocie",
                mov: "Ruchy w mieście:",
                WaUp: "Ściana<25",
                Rev2: "płomień R2",
                Def1: "obrona Terre",
                Bir1: "obrona Birremes",
                OC: "OC",
                R2: "R2 Góra:",
                FR2: " Koniec R2: ",
                f_R212: "Bunt 12H",
                f_R210: "Bunt 10H",
                NTS: "Jednostki bez szczegółów",
                fooster: "👆 / 👇 lub nic",
                leg: "WW Wonders",
                stg: "Poziom",
                tot: "Całkowity",
                str: "Zespoly",
                los: "straty",
                mod: "Nie modyfikujący wpływ",
                dsc: "jednostki porównania",
                hck: "Wpływ",
                prc: "Skaleczenie",
                dst: "Arremço",
                sea: "Morski",
                att: "Ofensywa",
                def: "Obronny",
                spd: "prędkość",
                bty: "Booty (zasoby)",
                cap: "Możliwość transportu",
                res: "Koszt (zasoby)",
                fav: "przysługa",
                tim: "Rekrutacja czas (s)",
                BBV: "BB-Code Miasto",
                rat: "Wskaźnik zasobów od typu urządzenia",
                shr: "Ze składowania na miasta docelowego",
                per: "handel procent",
                lab: "jednostki wysłany",
                cityfestivals: "festiwale miejskie",
                improved_movement: "oddziały jazdy z regulacją bonusowej",
                cap_of_invisibility: "Czas niewidzialności, Czas zakończenia efektu"
            },
            messages: {
                export: "Konwersja wiadomości do BB-Code",
                Tol: "Kopiuj i wklej",
                copy: "Kopiuj",
                bbmessages: "Komunikaty BB-Code",
                copybb: "BB kod został skopiowany",
            },
            grepo_mainmenu: {
                city_view: "Widok miasta",
                island_view: "Widok na wyspę"
            },
            buttons: {
                sav: "Zapisać",
                ins: "Wstawić",
                res: "Resetowanie"
            }
        },
        ////////////////////////////////////////////
       // Romanian  (RO) Translation by Joeman   //
      ////////////////////////////////////////////
        ro: {
            link: {
                Update: "https://mycitygre.000webhostapp.com/Dio-Tools/Dio_tools/changelog-en/index.html",
                contact: "http://grepotemas.blogspot.com/",
                forum: "https://mycitygre.000webhostapp.com/Dio-Tools/index.html",
                UnitComparison: "https://wiki.en.grepolis.com/wiki/Units_Portal/"
            },
            settings: {
                dsc: "Gatinho ofera, printre alte lucruri, unele ecrane, o cutie zâmbitoare, opțiuni de tranzacționare<br> și unele schimbări în structura.",
                prv: "Previzualizați mai multe caracteristici:",
                act: "Activarea / dezactivarea setului de instrumente caracteristici:",
                version_old: "Versiunea nu este actualizată",
                version_new: "Versiunea este actualizată",
                version_dev: "versiune dezvoltator",
                version_update: "Actualizați",
                cat_wonders: "WW",
                Update: "Versiune curentă V" + version,
                link_forum: "https://mycitygre.000webhostapp.com/Dio-Tools/index.html",
                link_contact: "https://mycitygre.000webhostapp.com/Dio-Tools/index.html",
                link_Excel: "https://docs.zoho.com/file/5y2lva773ddcde22f4ebc8febadec843aaceb",
                forum: "forum",
                author: "Autor",
                Feature: "Optiune noua",
                cat_units: "Unități",
                cat_icons: "Icoane în orașe",
                cat_forum: "forum",
                cat_trade: "comerț",
                cat_wonders: "WW",
                cat_layout: "schemă",
                cat_other: "Alții",
                cat_moi: "Adiţional",
                cat_nova: "premiu",
                cat_them: "🎨"
            },
            options: {
                Blue: 'Albastru',
                Red: 'Roșu',
                Purple: 'Violet',
                Yellow: 'Galben',
                Pink: 'Trandafir',
                Halloween: 'Halloween',
                Christmas: 'Crăciun',
                Dead: 'Gaură',
                Abes: 'Abes',
                Groot: 'Groot',
                themco: 'Cele colorate',
                themgif: 'Cele animate',
                test: ["Activați / dezactivați lista temelor colorate. ", "Selectați oricare dintre temele disponibile, (Teme color)."],
                ava: ["Privire de ansamblu asupra unităților", "Indică unitățile tuturor orașelor"],
                sml: ["smilies", "Extinde bbcode cu o cutie zâmbitoare"],
                str: ["Forța trupelor", "Adaugă cadre de putere trupe în mai multe domenii"],
                tra: ["Capacitatea de transport", "Arată capacitatea de transport ocupat și disponibile în meniul unitate"],
                per: ["procent de comerț", "Extinde fereastra de comerț cu un procentaj de comerț"],
                rec: ["Commerce pentru recrutare", "Extinde fereastra de comerț cu un comerț de recrutare"],
                cnt: ["mișcare Counter", "Atacurile contra / sprijin în fereastra de realizare"],
                way: ["Viteza militară", "Afișează arată posibila viteza trupelor în fereastra de atac / suport"],
                sim: ["Simulator", "Adaptarea aspectului simulatorului și expoziție permanentă a casetei de puteri extinse"],
                spl: ["Cash Puteri Divine", "Mici și mobile cutie magnetice puteri divine (cu memorie de poziție)"],
                pop: ["favoruri divine caseta", "Modifică favorurile divine cutie cu un nou aspect"],
                tsk: ["bara de activități", "Crește bara de activități și minimizează fereastra de zi cu zi recompensa la început"],
                for: ["formularul Excel", "Formularul Excel pentru Siege"],
                bbc: ["Suport aplicatie", "Extinde bar cu un mod BB pentru a solicita asistență automată"],
                com: ["comparație Unități", "Adăugați tabele de comparație unitate"],
                tic: ["Icoane în orașe", "Fiecare oraș primește o pictogramă pentru tipul de trupe în oraș (detectare automată)", "pictograme suplimentare sunt disponibile pentru selectarea manuală"],
                til: ["Lista orașelor", "Adaugă pictograme orașului în lista de orașe"],
                tim: ["Hartă", "Afișează iconițe ale orașelor pe hartă strategică"],
                wwc: ["WW Calculator", "& Calcul partajat resurse contor + butoane anterioare și următoare minuni ale lumii (în prezent, nu dezactivat!)"],
                wwr: ["Clasificare", "Clasificarea minune a lumii reproiectat"],
                wwi: ["icoane", "Adaugă pictograme în minunea lumii în harta strategică"],
                con: ["Meniul contextual", "Exchange Selectați orașul și Prezentare generală a orașelor din meniul contextual"],
                sen: ["Unități trimise", "Unități spectacole trimise în fereastra de atac / suport"],
                tov: ["Panorama orasului", "Înlocuiește noua panorama orașului cu stilul ferestrei vechi"],
                scr: ["Rotița mouse-ului", "Modificări cu mouse-ul moleta, viziune Island / Harta"],
                stt: ["Grepodata Statistici", "Adaugă un buton pentru a vedea lumea statică"],
                err: ["trimite automat rapoarte de eroare", "Dacă activați această opțiune, puteți ajuta la identificarea erorilor."],
                Tti: ["Resurse comerciale pentru festivaluri", "Click aici pentru a trimite resurse la un festival"],
                Isl: ["Island View", "Creșterea înălțimea listei orașelor."],
                Ish: ["Resursele satelor (activ Captain)", "(Colecta toate recussos insulele din 1 clic)"],
                Exi: ["Cerinţă:", "💰  Activare ->"],
                OCC: ["Ocean Număr", "Visualisa Ocean Numero"],
                BBV: ["City în BB-Code", "Adaugă orașul curent BBcodigo"],
                CVW: ["Buton oraș / Harta", "Adaugă un buton pentru a comuta între viziunea și harta orașului."],
                Mess: ["multumesc pentru incredere", "Asigurați-vă noi module disponibile pentru falicidar zi la zi sarcini în joc, testat și aprobat.!."],
                Ciw: ["Vedere a orașului / fereastra", "Arată vederi ale orașului într-o fereastră"],
                act: ["Activați casetele derulante și atac comercial", "Îmbunătățirile de afișare comerciale și cutii de recrutare (cu memorie de poziție)"],
                Bjc: ["Butonul BB-cod", "Adăugarea unui buton BBcode (jucător și alianță)"],
                SUA: ["Adăugați (nr suprasarcină / Reset)", "Noi instrumente în atac și fereastra de sprijin."],
                Mse: ["menssagens BB-Code", "Convertește menssagens în BB-Code"],
                Cul: ["Privire de ansamblu asupra culturii (Administrator)", "Adaugă un număr de toate parade"],
                Hid: ["	Adăugați la peșteră	", "Adăugări de argint la pestera din depozit au peste 15K."],
                Hio: ["	Vezi pesterilor (Administrator)	", "5 categorii de căutare disponibile."],
                ubv: ["	populaţia capacitate", "capacitatea de a sprijini - în largul insulei."],
                her: ["cucerirea Traciei", "harta reducerea dimensiunilor realizare tracic."]
            },
            Quack: {
                cityfestivals: "Festivalul urban",
                olympicgames: "jocuri Olimpice",
                triumph: "parada Victoriei",
                theater: "spectacole de teatru"
            },
            labels: {
                stt: "Grepodata Statistici",
                uni: "Privire de ansamblu asupra unităților",
                total: "Global",
                available: "Disponibil",
                outer: "afară",
                con: "selectați oraș",
                no_overload: "fără supraîncărcare",
                std: "Standard",
                gre: "Grepolis",
                nat: "Natural",
                ppl: "Popular",
                oth: "Alții",
                hal: "Halloween",
                xma: "Crăciun",
                ttl: "Suport aplicatie",
                inf: "info Oraș:",
                dev: "precizie",
                det: "Unități detaliate",
                prm: "Premium bonus",
                sil: "Argint la Grota",
                mov: "Mișcările din oraș:",
                WaUp: "Perete<25",
                Rev2: "Flame R2",
                Def1: "apărare Terre",
                Bir1: "apărare Birremes",
                OC: "OC",
                R2: "R2 Top:",
                FR2: " Sfârșitul R2: ",
                f_R212: "Răscoală 12H",
                f_R210: "Răscoală 10H",
                NTS: "Unități fără detalii",
                fooster: "👆 / 👇 sau nimic",
                leg: "WW minuni",
                stg: "Nivel",
                tot: "Total",
                str: "Blocuri de alimentare",
                los: "pierderi",
                mod: "Nici o influență modificator",
                dsc: "Unități de comparare",
                hck: "efect",
                prc: "A tăia",
                dst: "Arremço",
                sea: "Naval",
                att: "Ofensator",
                def: "Defensivă",
                spd: "viteză",
                bty: "Prădarea (resurse)",
                cap: "Capacitatea de transport de",
                res: "Costul (resurse)",
                fav: "favoare",
                tim: "Timpul de recrutare (s)",
                BBV: "BB-City Code",
                rat: "Raportul resursa de un singur tip de unitate",
                shr: "Din depozitarea pe orașul de destinație",
                per: "procent de comerț",
                lab: "Unități SENT",
                cityfestivals: "festivaluri urbane",
                improved_movement: "Trupele conduce cu reglare bonus",
                cap_of_invisibility: "Timpul invizibilității, Ora de încheiere a efectului"
            },
            messages: {
                export: "Mesaj Conversia la BB-Code",
                Tol: "Copiaza si lipeste",
                copy: "Copie",
                bbmessages: "Mesajele BB-Code",
                copybb: "BB-Code a fost copiat",
            },
            grepo_mainmenu: {
                city_view: "Panorama orasului",
                island_view: "Vezi de Insula"
            },
            buttons: {
                sav: "A salva",
                ins: "Introduce",
                res: "Resetați"
            }
        },
        //////////////////////////////////////////
       // Spanish (es) Translation by Joeman   //
      //////////////////////////////////////////
        es: {
            link: {
                Update: "https://mycitygre.000webhostapp.com/Dio-Tools/Dio_tools/changelog-en/index.html",
                contact: "http://grepotemas.blogspot.com/",
                forum: "https://mycitygre.000webhostapp.com/Dio-Tools/index.html",
                UnitComparison: "https://wiki.en.grepolis.com/wiki/Units_Portal/"
            },
            settings: {
                dsc: "Gatinho ofrece, entre otras cosas, algunas pantallas, una caja sonriente, las opciones de comercio<br> y algunos cambios en el diseño.",
                prv: "Una vista previa de varias características:",
                act: "Activar / desactivar las funciones de la caja de herramientas:",
                version_old: "Versión no se actualiza",
                version_new: "Versión se actualiza",
                version_dev: "versión para desarrolladores",
                version_update: "actualizar",
                cat_wonders: "WW",
                Update: "Versión actual V" + version,
                link_forum: "https://mycitygre.000webhostapp.com/Dio-Tools/index.html",
                link_contact: "https://mycitygre.000webhostapp.com/Dio-Tools/index.html",
                link_Excel: "https://docs.zoho.com/file/5y2lva773ddcde22f4ebc8febadec843aaceb",
                forum: "Foro",
                author: "Autor",
                Feature: "Nueva caracteristica",
                cat_units: "Unidades",
                cat_icons: "Los iconos en las ciudades",
                cat_forum: "Foro",
                cat_trade: "Comercio",
                cat_wonders: "WW",
                cat_layout: "diseño",
                cat_other: "Otros",
                cat_moi: "Adicional",
                cat_nova: "Prima",
                cat_them: "🎨"
            },
            options: {
                Blue: 'Azul',
                Red: 'Rojo',
                Purple: 'Púrpura',
                Yellow: 'Amarillo',
                Pink: 'Rosa',
                Halloween: 'Halloween',
                Christmas: 'Navidad',
                Dead: 'Agujero',
                Abes: 'Abes',
                Groot: 'Groot',
                themco: 'Los de colores',
                themgif: 'Los animados',
                test: ["Activar / desactivar la lista de temas de colores. ", "Seleccione cualquiera de los temas disponibles, (Temas de color)"],
                ava: ["Descripción general de las unidades", "Indica las unidades de todas las ciudades"],
                sml: ["emoticones", "Extiende el BBCode con una caja sonriente"],
                str: ["Fuerza de tropas", "Añade potencia marcos de tropas en varias áreas"],
                tra: ["la capacidad de transporte", "Muestra la capacidad de transporte ocupados y disponibles en el menú de la unidad"],
                per: ["porcentaje del comercio", "Se extiende la ventana de comercio con un porcentaje del comercio"],
                rec: ["Comercio para el reclutamiento", "Se extiende la ventana de comercio con un comercio de contratación"],
                cnt: ["contador de movimiento", "contraataques / soporte en la ventana de logro"],
                way: ["velocidad militar", "Pantallas muestran la velocidad de tropas posible en la ventana de ataque / apoyo"],
                sim: ["Simulador", "Adaptación del diseño del simulador y exposición permanente de la caja poderes extendida"],
                spl: ["Efectivo poderes divinos", "Pequeñas y móviles de la caja magnética poderes divinos (con memoria de posición)"],
                pop: ["caja favores divinos", "Cambia los favores divinos caja con un nuevo diseño"],
                tsk: ["barra de tareas", "Aumenta la barra de tareas y minimiza la ventana de recompensa diaria de inicio"],
                for: ["formulario de Excel", "formulario de Excel para Cerco"],
                bbc: ["Soporte de aplicaciones", "Se extiende la barra BBCode con una forma de pedir ayuda automática"],
                com: ["Comparación de unidades", "Añadir tablas de comparación de unidad"],
                tic: ["Los iconos en las ciudades", "Cada ciudad recibe un icono para el tipo de tropas en la ciudad (detección automática)", "iconos adicionales están disponibles para la selección manual"],
                til: ["Lista de las ciudades", "Añade iconos de la ciudad en la lista de ciudades"],
                tim: ["Mapa", "Muestra los iconos de las ciudades sobre el mapa estratégico"],
                wwc: ["WW Calculadora", "Y cálculo de recursos compartidos contador + botones anterior y siguiente maravillas del mundo (actualmente no está desactivada),"],
                wwr: ["Clasificación", "Clasificación de la maravilla del mundo rediseñado"],
                wwi: ["iconos", "Añade iconos de la maravilla del mundo en el mapa estratégico"],
                con: ["Menú de contexto", "Seleccione el intercambio ciudad y visión general de las ciudades en el menú contextual"],
                sen: ["unidades enviadas", "unidades muestra enviados en la ventana de ataque / apoyo"],
                tov: ["Vista de la ciudad", "Sustituye el nuevo panorama de la ciudad con el estilo de la ventana de edad"],
                scr: ["Rueda de ratón", "Los cambios de la moleta del ratón, la visión Island / Mapa"],
                stt: ["Estadísticas utilizadas Grepodata", "Añade un botón para ver el mundo estático"],
                err: ["Enviar automáticamente informes de errores", "Si habilita esta opción, puede ayudar a identificar errores."],
                Tti: ["recursos comerciales para fiestas", "Haga clic para enviar recursos a un festival"],
                Isl: ["Island View", "Aumentar la altura de la lista de ciudades y pueblos."],
                Ish: ["Los recursos de los pueblos (activo capitán)", "(Recoge todas recussos las islas en 1 clic)"],
                Exi: ["Requisito:", "💰  Activar ->"],
                OCC: ["Número océano", "Visualisa Océano numero"],
                BBV: ["Ciudad de BB-Code", "Añade la ciudad actual BBcodigo"],
                CVW: ["Botón Ciudad / Mapa", "Añade un botón para cambiar entre la visión y el mapa de la ciudad."],
                Mess: ["gracias por tu confianza", "Hacer nuevos módulos disponibles para falicidar su día a día las tareas en el juego, probado y aprobado.!."],
                Ciw: ["Vista de la ciudad / ventana", "Mostrar vistas de la ciudad en una ventana"],
                act: ["Activar cuadros desplegables y ataque Comercial", "visualización mejoras cajas y contratación (con memoria de posición) el comercio"],
                Bjc: ["Botón de código BB", "La adición de un botón de Bbcode (jugador y alianza)"],
                SUA: ["Añadir (No hay sobrecarga / Reset)", "Las nuevas herramientas de ataque y la ventana de ayuda."],
                Mse: ["menssagens código BB", "Convierte menssagens en BB-Code"],
                Cul: ["Descripción general de la cultura (Administrador)", "Añade un recuento de todos los desfiles"],
                Hid: ["	Añadir a la cueva", "Añade la plata a la cueva en el almacén tiene más de 15K."],
                Hio: ["	Vista de las cuevas (Administrador)	", "5 categorías disponibles de búsqueda."],
                ubv: ["	la capacidad de la población", "apoyar la capacidad - fuera de la isla."],
                her: ["conquista de Tracia", "mapa reducción del tamaño de los logros de Tracia."]
            },
            Quack: {
                cityfestivals: "Festival urbano",
                olympicgames: "Juegos Olímpicos",
                triumph: "desfile de la victoria",
                theater: "Piezas de teatro"
            },
            labels: {
                stt: "Estadísticas utilizadas Grepodata",
                uni: "Descripción general de las unidades",
                total: "Global",
                available: "Disponible",
                outer: "Afuera",
                con: "Ciudad selecta",
                no_overload: "sin sobrecarga",
                std: "Estándar",
                gre: "Grepolis",
                nat: "Natural",
                ppl: "Popular",
                oth: "Otros",
                hal: "Víspera de Todos los Santos",
                xma: "Navidad",
                ttl: "Soporte de aplicaciones",
                inf: "información de la ciudad:",
                dev: "precisión",
                det: "unidades detalladas",
                prm: "bono premium",
                sil: "Plata en la Gruta",
                mov: "Los movimientos en la ciudad:",
                WaUp: "pared<25",
                Rev2: "llama R2",
                Def1: "defensa Terre",
                Bir1: "defensa Birremes",
                OC: "jefe",
                R2: "R2 Top:",
                FR2: " Final R2: ",
                f_R212: "Revuelta 12H",
                f_R210: "Revuelta 10H",
                NTS: "Unidades sin Detalles",
                fooster: "👆 / 👇 ou nada",
                leg: "WW Maravillas",
                stg: "Nivel",
                tot: "Total",
                str: "Las unidades de potencia",
                los: "Pérdidas",
                mod: "Ninguna influencia modificador",
                dsc: "unidades de comparación",
                hck: "Impacto",
                prc: "Cortar",
                dst: "Arremço",
                sea: "Naval",
                att: "Ofensiva",
                def: "Defensivo",
                spd: "velocidad",
                bty: "Botín (recursos)",
                cap: "Capacidad de transporte",
                res: "Costo (recursos)",
                fav: "favor",
                tim: "Tiempo de contratación (s)",
                BBV: "BB City Code",
                rat: "proporción de recursos de un tipo de unidad",
                shr: "Desde el almacenamiento en la ciudad de destino",
                per: "porcentaje del comercio",
                lab: "unidades enviadas",
                cityfestivals: "festivales urbanos",
                improved_movement: "tropas coche con ajuste de bonificación",
                cap_of_invisibility: "Tiempo de invisibilidad, Hora de finalización del efecto"
            },
            messages: {
                export: "mensaje convertido al BB-Code",
                Tol: 'Copiar e colar',
                copy: "Copiar",
                bbmessages: "Mensajes de código BB",
                copybb: "Código BB fue copiado",
            },
            grepo_mainmenu: {
                city_view: "Vista de la ciudad",
                island_view: "Vista de la isla"
            },
            buttons: {
                sav: "Ahorrar",
                ins: "Insertar",
                res: "Reiniciar"
            }
        },
        ar: {},
        //////////////////////////////////////////////
       //   Portuguese (BR) Translation by  HELL   //
      //////////////////////////////////////////////
        br: {
            link: {
                Update: "https://mycitygre.000webhostapp.com/Dio-Tools/Dio_tools/changelog-en/index.html",
                contact: "http://grepotemas.blogspot.com/",
                forum: "https://mycitygre.000webhostapp.com/Dio-Tools/index.html",
                UnitComparison: "https://wiki.en.grepolis.com/wiki/Units_Portal/"
            },
            settings: {
                dsc: "Gatinho oferece, entre outras coisas, algumas telas, uma caixa de smiley, opções de comércio <br> e algumas alterações no layout.",
                prv: "Pré-visualização de vários recursos:",
                act: "Ativar/desativar recursos do conjunto de ferramentas:",
                version_old: "Versão não está atualizada",
                version_new: "Versão está atualizada",
                version_dev: "Versão do desenvolvedor",
                version_update: "Atualização",
                cat_wonders: "WW",
                Update: "Versão atual  V" + version,
                link_forum: "https://mycitygre.000webhostapp.com/Dio-Tools/index.html",
                link_contact: "https://mycitygre.000webhostapp.com/Dio-Tools/index.html",
                link_Excel: "https://docs.zoho.com/file/5y2lva773ddcde22f4ebc8febadec843aaceb",
                forum: "Fórum",
                author: "Autor",
                Feature: "Novo Recurso",
                cat_units: "Unidades",
                cat_icons: "Ícones nas Cidades",
                cat_forum: "Fórum",
                cat_trade: "Comércio",
                cat_wonders: "WW",
                cat_layout: "Layout",
                cat_other: "Outros",
                cat_moi: "Adicional",
                cat_nova: "Premium",
                cat_them: "🎨"
            },
            options: {
                Blue: 'Azul',
                Red: 'Vermelho',
                Purple: 'Purple',
                Yellow: 'Yellow',
                Pink: 'Pink',
                Halloween: 'Halloween',
                Christmas: 'Natal',
                Dead: 'Buraco',
                Abes: 'Abes',
                Groot: 'Groot',
                themco: 'Os coloridos',
                themgif: 'Os animados',
                test: ["Ativar/Desativar a lista dos temas coloridos ", "Seleciona qualquer um dos temas disponiveis, (Temas Coloridos)"],
                ava: ["Visão Geral das unidades", "Indica as unidades de todas as cidades"], // ?
                sml: ["Smilies", "Estende o bbcode com uma caixa de smiley"],
                str: ["Força das Tropas", "Adiciona quadros de força das tropas em diversas áreas"],
                tra: ["Capacidade de Transporte", "Mostra a capacidade de transporte ocupado e disponível no menu de unidades"],
                per: ["Percentual de comércio", "Estende-se a janela de comércio com um percentual de comércio"],
                rec: ["Comércio para recrutamento", "Estende-se a janela de comércio com um comércio de recrutamento"],
                cnt: ["Contador de movimentos", "Contador os ataques/apoios na janela de conquista"],
                way: ["Velocidade da Tropa", "Mostram a possivél velocidade de tropa na janela de ataque/suporte"],
                sim: ["Simulador", "Adaptação do layout simulador & exposição permanente da caixa poderes estendida"],
                spl: ["Caixa de Poderes Divinos", "Pequena caixa móvel & magnética de poderes divinos (com memória de posição) "],
                pop: ["Caixa de favores divino", "Altera a caixa de favores divino por um novo layout"],
                tsk: ["Barra de tarefas", "Aumenta a barra de tarefas e minimiza a janela recompensa diária no inicio"],
                for: ["Formulário Excel", "Formulário Excel para Cerco, "],
                bbc: ["Pedido de Apoio", "Estende a barra de bbcode com uma forma de Pedido de Apoio Automática"],
                com: ["Comparação de Unidades", "Adiciona tabelas de comparação de unidade"],
                tic: ["Ícones nas Cidades", "Cada cidade recebe um ícone para o tipo de tropas na cidade (deteção automática) ", " Ícones adicionais estão disponíveis para seleção manual"],
                til: ["Lista das Cidades", "Adiciona os ícones da cidade na lista de cidades"],
                tim: ["Mapa", "Mostra os ícones das cidades no mapa estratégico"],
                wwc: ["Calculadora de WW", "Cálculo compartilhado & contador de recursos + botões anterior e próxima maravilhas do mundo (atualmente não desativável!)"],
                wwr: ["Classificação", "Classificação das maravilha do mundo redesenhadas"],
                wwi: ["Ícones", 'Adiciona ícones nas maravilha do mundo no mapa estratégico'],
                con: ["Menu de Contexto", 'Troca da "Selecione cidade" e "Visão Geral das Cidades" no menu de contexto'],
                sen: ["Unidades Enviadas", 'Shows sent units in the attack/support window'],
                tov: ["Visão da Cidade", 'Substitui o novo panorama da cidade, com o estilo da janela antiga'],
                scr: ["Roda do Mouse", 'Altera com a moleta do rato, visão Ilha/Mapa'],
                stt: ["Statistiques Grepodata", "Adiciona um botão para ver as estatística do mundo"],
                err: ["Enviar automaticamente relatórios de erros", "Se você ativar essa opção, você pode ajudar a identificar erros."],
                Tti: ["Comércio de recursos para festivais", "Clique para enviar recursos para um festival"],
                Isl: ["Visualização da ilha", "Aumentar a altura da lista de cidades e vilas."],
                Ish: ["Recursos das aldeias (Capitão ativo)", "(Recolha todos os recussos das ilhas em 1 clic)"],
                Exi: ["Exigência:", "💰 Ativem -->"],
                OCC: ["Numero do Oceano", "Visualiza o numero Oceano"],
                BBV: ["City BBcode", "Adiciona a cidade atual bbcode"],
                CVW: ["Botão Cidade/Mapa", "Adiciona um botão para alternar entre a visão da cidade e mapa."],
                Mess: ["Thank you for your trust", "Disponibilizem de novos módulos para facilitar as vossas tarefas do dia a dia no jogo, testados e aprovados.!."],
                Ciw: ["Vista da cidade/janela", "Mostrar vista para a cidade em uma janela"],
                act: ["Ativar caixas suspensas de comércio e ataque", "Melhorias da exibição de caixas de comércio e recrutamento (com memória de posição)"],
                Bjc: ["Botão BBcode ", " Adição de um botão BBcode (jogador e aliança)"],
                SUA: ["Adicionar (Sem sobrecarga / Redefinir) ", "  Novas ferramentas na janela de ataque e suporte."],
                Mse: ["BB-Code mensagens", "Converte mensagens em BB-Code"],
                Cul: ["Visão geral da cultura (Administrador)", "Adiciona um contador de todas os desfiles"],
                Hid: ["Adicionar para gruta", "Acrescenta prata para a gruta se no armazém tiver acima dos 15K."],
                Hio: ["Vista das grutas (Administrador)", "5 categorias disponíveis de procura."],
                ubv: ["Capacidade população", "Capacidade apoio - fora da ilha."],
                her: ["Conquista Thracian", "Redução de tamanho do mapa da conquista Thracian."]
            },
            Quack: {
                cityfestivals: "Festival Urbano",
                olympicgames: "Jogos Olímpicos",
                triumph: "Desfile da Vitória",
                theater: "Peças de Teatro"
            },
            labels: {
                stt: "Estáticas Grepodata",
                uni: "Visão Geral das unidades",
                total: "Global",
                available: "Disponível",
                outer: "Fora",
                con: "Selecionar cidade",
                no_overload: "Sem sobrecarga",
                std: "Padrão",
                gre: "Grepolis",
                nat: "Natural",
                ppl: "Popular",
                oth: "Outros",
                hal: "Halloween",
                xma: "Natal",
                ttl: "Pedido de Apoio",
                inf: "Informação da cidade:",
                dev: "Precisão de",
                det: "Unidades Detalhadas",
                prm: "Bônus Premium",
                sil: "Prata na Gruta",
                mov: "Movimentos na cidade:",
                WaUp: "Muralha <25",
                Rev2: "Chama R2",
                Def1: "Defesa Terrestre.",
                Bir1: "Defesa Bireme.",
                OC: "OC",
                R2: "Inicio R2: ",
                R1: "Inicio R1: ",
                FR2: " Fim R2: ",
                f_R212: "Revolta 12H",
                f_R210: "Revolta 10H",
                NTS: "Unidades sem Detalhes",
                fooster: "👆 / 👇 ou nada",
                leg: "WW Maravilhas",
                stg: "nível",
                tot: "Total",
                str: "Força das Unidades",
                los: "Perdas",
                mod: "Sem modificador de influência",
                dsc: "Comparação de unidades",
                hck: "Impacto",
                prc: "Corte",
                dst: "Arremesso",
                sea: "Naval",
                att: "Ofensivo",
                def: "Defensivo",
                spd: "Velocidade",
                bty: "Saque (recursos)",
                cap: "Capacidade de transporte",
                res: "Custo (recursos)",
                fav: "Favor",
                tim: "Tempo de recrutamento (s)",
                BBV: "código BB da cidade",
                rat: "Proporção de recursos de um tipo de unidade",
                shr: "A partir do armazenamento sobre a cidade de destino",
                per: "Percentual de comércio",
                lab: "Unidades enviadas",
                cityfestivals: "Festivais Urbanos",
                improved_movement: "Movimento das tropas com ajuste de bónus",
                cap_of_invisibility: "Tempo da invisibilidade, Hora do fim do efeito"
            },
            caves: {
                stored_silver: 'Moedas de prata armazenadas',
                silver_to_store: 'Moedas de prata para armazenar',
                name: 'Nome',
                wood: 'Madeira',
                stone: 'Pedra',
                silver: 'Moedas de prata'
            },
            messages: {
                export: 'Converter mensagem em BB-Code',
                Tol: 'Copiar e colar',
                copy: 'Copiar',
                bbmessages: 'Mensagens do BB-Code',
                copybb: 'BBCode foi copiado'
            },
            grepo_mainmenu: {
                city_view: 'Vista da cidade',
                island_view: 'Vista da ilha'
            },
            buttons: {
                sav: "Salvar",
                ins: "Inserir",
                res: "Resetar"
            }
        },
        pt: {},
        //////////////////////////////////////////////////
       //      Tcheque (CS) Translation by JoeMan      //
      //////////////////////////////////////////////////
        cz: {
            link: {
                Update: "https://mycitygre.000webhostapp.com/Dio-Tools/Dio_tools/changelog-en/index.html",
                contact: "http://grepotemas.blogspot.com/",
                forum: "https://mycitygre.000webhostapp.com/Dio-Tools/index.html",
                UnitComparison: "https://wiki.en.grepolis.com/wiki/Units_Portal/"
            },
            settings: {
                dsc: "GATINNO nabízí mimo jiné několik obrazovek, jeden smajlík box, obchodní možnosti<br> a některé změny v rozložení.",
                prv: "Náhled několik funkcí:",
                act: "Povolit / zakázat toolkit je k dispozici:",
                version_old: "Verze není aktualizován",
                version_new: "Verze je aktualizována",
                version_dev: "developer version",
                version_update: "Aktualizace",
                cat_wonders: "WW",
                Update: "Současná verze V" + version,
                link_forum: "https://mycitygre.000webhostapp.com/Dio-Tools/index.html",
                link_contact: "https://mycitygre.000webhostapp.com/Dio-Tools/index.html",
                link_Excel: "https://docs.zoho.com/file/5y2lva773ddcde22f4ebc8febadec843aaceb",
                forum: "Fórum",
                author: "Autor",
                Feature: "Nová vlastnost",
                cat_units: "Jednotky",
                cat_icons: "Ikony ve městech",
                cat_forum: "Fórum",
                cat_trade: "Obchod",
                cat_wonders: "WW",
                cat_layout: "dispozice",
                cat_other: "jiní",
                cat_moi: "Další",
                cat_nova: "Pojistné",
                cat_them: "🎨"
            },
            options: {
                Blue: 'Modrý',
                Red: 'Červené',
                Purple: 'nachový',
                Yellow: 'Žlutá',
                Pink: 'růže',
                Halloween: 'Halloween',
                Christmas: 'Vánoce',
                Dead: 'Otvor',
                Abes: 'Abes',
                Groot: 'Groot',
                themco: 'ty barevné',
                themgif: 'ty animované',
                test: ["Povolte/zakažte seznam barevných motivů. ", "Vyberte libovolné z dostupných motivů, (Barevné motivy)"],
                ava: ["Přehled jednotek", "Označuje jednotky všech městech"],
                sml: ["smajlíky", "Rozšiřuje používání značek s smajlík boxu"],
                str: ["Síla vojska", "Dodává elektrické rámy vojáků v několika oblastech"],
                tra: ["kapacita doprava", "Ukazuje rušné přepravní kapacitu a je k dispozici v menu disku"],
                per: ["obchod procento", "Rozšiřuje okna obchodu s ochrannou procentech"],
                rec: ["Commerce pro nábor", "Rozšiřuje okna obchodu s obchodem náboru"],
                cnt: ["Counter motion", "Protiútoky / support v okně výkonové"],
                way: ["vojenská Speed", "Displeje ukazují možnou rychlost vojáků v útoku okna / support"],
                sim: ["simulátor", "Přizpůsobení rozložení simulátoru a stálé expozice rozšířenou působností boxu"],
                spl: ["Cash Divine Powers", "Malé a pohyblivé magnetické box božské síly (s pamětí polohy)"],
                pop: ["božské laskavosti box", "Změní božské laskavosti box s novým uspořádáním"],
                tsk: ["Hlavní panel", "Zvyšuje na hlavním panelu a minimalizuje denní okno odměnu na začátku"],
                for: ["formulář Excel", "Excel formulář pro obležení"],
                bbc: ["Podpora aplikace", "Rozšiřuje Přímo bar s způsob, jak požádat o pomoc Automatic"],
                com: ["srovnání jednotek", "Přidejte srovnávací tabulky drive"],
                tic: ["Ikony ve městech", "Každé město obdrží ikonu pro typ vojáků v centru (automatická detekce)", "další ikony jsou k dispozici pro ruční výběr"],
                til: ["Seznam měst", "Přidá ikony městským v seznamu měst"],
                tim: ["Mapa", "Zobrazuje ikony měst na strategické mapě"],
                wwc: ["WW Calculator", "A sdílený výpočet counter zdroj + předchozí a následující tlačítka divů světa (v současné době není deaktivován!)"],
                wwr: ["Klasifikace", "Klasifikace divem světa přepracovány"],
                wwi: ["ikony", "Přidá ikony v divu světa ve strategické mapy"],
                con: ["Kontextová nabídka", "Exchange Vyberte město a přehled měst v kontextovém menu"],
                sen: ["odeslané jednotky", "Ukazuje jednotky poslal v okně útoku / podpůrného"],
                tov: ["výhled na město", "Nahradí nové panorama města se stylem starého okna"],
                scr: ["Kolečko myši", "Změny se moleta myš vidění Island / Mapa"],
                stt: ["Statistiques Grepodata", "Přidá tlačítko vidět statický svět"],
                err: ["Automaticky odesílat zprávy o chybách", "Máte-li tuto možnost, můžete pomoci identifikovat chyby."],
                Tti: ["Obchod zdroje pro festivaly", "Kliknutím odešlete zdroje na festival"],
                Isl: ["Island View", "Zvětšit výšku seznamu měst a obcí."],
                Ish: ["Zdroje obcí (aktivní kapitán)", "(Shromažďovat všechny recussos ostrovy v 1 kliknutí)"],
                Exi: ["Požadavek:", "💰  Aktivovat ->"],
                OCC: ["Ocean Number", "Visualisa Ocean numero"],
                BBV: ["City v BB-Code", "Přidá aktuální město BBcodigo"],
                CVW: ["Tlačítko City / Mapa", "Přidá tlačítko pro přepnutí mezi vizí a mapu města."],
                Mess: ["Děkuji za důvěru", "Zpřístupnit nové moduly pro falicidar své každodenní úkoly ve hře, testováno a schváleno.!."],
                Ciw: ["Pohled na město / okně", "Ukazují pohledy na město v okně"],
                act: ["Umožňují drop-dolů boxy i komerční útoku", "Vylepšení zobrazení obchodovat boxy a nábor (s pamětí polohy)"],
                Bjc: ["Tlačítko BB-code", "Přidání tlačítka BBcode (hráč a aliance)"],
                SUA: ["Přidejte (Bez přetížení / Reset)", "Nové nástroje v útoku a okna podporu."],
                Mse: ["BB-Code menssagens", "Převede menssagens v BB-Code"],
                Cul: ["Přehled kultury (Administrator)", "Přidá počet ze všech přehlídek"],
                Hid: ["	Přidat do jeskyně", "Přidá stříbro do jeskyně ve skladu mají více než 15K."],
                Hio: ["	Pohled z jeskyně (Administrator)", "5 kategorií k dispozici vyhledávání."],
                ubv: ["	populace kapacita", "podpoří schopnost - mimo ostrov"],
                her: ["dobytí Thracian", "Pro zmenšení velikosti thrácké úspěch."]
            },
            Quack: {
                cityfestivals: "Urban Festival",
                olympicgames: "olympijské hry",
                triumph: "Victory Parade",
                theater: "Divadelní představení"
            },
            labels: {
                stt: "Statistiques Grepodata",
                uni: "Přehled jednotek",
                total: "Globální",
                available: "K dispozici",
                outer: "Ven",
                con: "vyberte si město",
                no_overload: "bez přetížení",
                std: "Standard",
                gre: "Grepolis",
                nat: "Přírodní",
                ppl: "Oblíbený",
                oth: "jiní",
                hal: "předvečer Všech svatých",
                xma: "Vánoce",
                ttl: "Podpora aplikace",
                inf: "Město info:",
                dev: "přesnost",
                det: "Detailní jednotky",
                prm: "bonus Premium",
                sil: "Silver v jeskyni",
                mov: "Pohyby ve městě:",
                WaUp: "zeď<25",
                Rev2: "plamen R2",
                Def1: "obrana Terre",
                Bir1: "obrana Birremes",
                OC: "OC",
                R2: "R2 Top:",
                FR2: " Konec R2: ",
                f_R212: "Povstání 12H",
                f_R210: "Povstání 10H",
                NTS: "Unidades sem Detalhes",
                fooster: "👆 / 👇 nebo nic",
                leg: "WW Wonders",
                stg: "Úroveň",
                tot: "Celkový",
                str: "Power Units",
                los: "Ztráty",
                mod: "No modifikátor vliv",
                dsc: "Srovnání jednotek",
                hck: "Dopad",
                prc: "Střih",
                dst: "Arremço",
                sea: "Námořní",
                att: "Urážlivý",
                def: "Obranný",
                spd: "rychlost",
                bty: "Kořist (zdroje)",
                cap: "Schopnost dopravě",
                res: "Náklady (zdroje)",
                fav: "laskavost",
                tim: "Doba Recruitment (y)",
                BBV: "BB-Code City",
                rat: "Poměr zdroj jednoho typu jednotky",
                shr: "Ze skladu na cílové město",
                per: "obchod procento",
                lab: "poslal jednotky",
                cityfestivals: "Městské slavnosti",
                improved_movement: "vojska pohon s nastavením bonusového",
                cap_of_invisibility: "Čas neviditelnosti. Čas ukončení účinku"
            },
            messages: {
                export: "Převést zprávu BB-Code",
                Tol: 'Copiar e colar',
                copy: "kopírovat",
                bbmessages: "Zprávy BB-Code",
                copybb: "BB-Code byl zkopírován",
            },
            grepo_mainmenu: {
                city_view: "výhled na město",
                island_view: "Výhledem na ostrov"
            },
            buttons: {
                sav: "Zachránit",
                ins: "Vložit",
                res: "Reset"
            }
        }
    };
    LANG.ar = LANG.es;
    LANG.pt = LANG.br;
    LANG.cs = LANG.cz;
    if (!(uw.location.pathname.indexOf("game") >= 0)) {
        LID = uw.location.host.split(".")[1];
    }
    console.debug("SPRACHE", LID);
    function getText(category, name) {
        var txt = "???";
        if (LANG[LID]) {
            if (LANG[LID][category]) {
                if (LANG[LID][category][name]) {
                    txt = LANG[LID][category][name];
                } else {
                    if (LANG.en[category]) {
                        if (LANG.en[category][name]) {
                            txt = LANG.en[category][name];
                        }
                    }
                }
            } else {
                if (LANG.en[category]) {
                    if (LANG.en[category][name]) {
                        txt = LANG.en[category][name];
                    }
                }
            }
        } else {
            if (LANG.en[category]) {
                if (LANG.en[category][name]) {
                    txt = LANG.en[category][name];
                }
            }
        }
        return txt;
    }
    /////////////////////////////////////////
   //             * Settings *            //
  /////////////////////////////////////////
    var options_def = {
        bir: true,
        ava: true,
        sml: false,
        str: false,
        tra: false,
        per: true,
        rec: true,
        way: false,
        cnt: false,
        sim: false,
        spl: false,
        act: false,
        tsk: false,
        cha: true,
        pop: true,
        bbc: true,
        com: false,
        tic: true,
        til: true,
        tim: true,
        wwc: true,
        wwr: true,
        wwi: true,
        con: true,
        sen: false,
        tov: false,
        scr: true,
        stt: true,
        err: false,
        Tti: false,
        OCC: false,
        CVW: false,
        Ciw: false,
        Bjc: false,
        SUA: false,
        Mse: false,
        Isl: false,
        Ish: false,
        Cul: true,
        Hio: false,
        Hid: false,
        ubv: false,
        her: true,
        joe_ta: true,
        joe_tb: false,
        joe_tc: false,
        joe_td: false,
        joe_te: false,
        joe_tf: false,
        joe_tg: false,
        joe_th: false,
        joe_ti: false,
        joe_tj: false
    };
    if (uw.location.pathname.indexOf("game") >= 0) {
        for (var opt in options_def) {
            if (options_def.hasOwnProperty(opt)) {
                if (DATA.options[opt] === undefined) {
                    DATA.options[opt] = options_def[opt];
                }
            }
        }
    }
    ///////////////////////////////////////
   //           * Version *             //
  ///////////////////////////////////////
    var Messageversion = '';
    var version_text = '',
        version_color = 'black';
    $('<script src="https://mycitygre.000webhostapp.com/Verification%20Version%20DioTools.js"></script>').appendTo("head");
    function getLatestVersion() {
        $('<style id="joe_version">' +
            '#version_info .version_icon { background: url(' + joe_sprite + ') -50px -50px no-repeat; width:25px; height:25px; float:left; } ' +
            '#version_info .version_icon.red { filter:hue-rotate(-30deg); -webkit-filter: hue-rotate(-30deg); } ' +
            '#version_info .version_icon.green { filter:hue-rotate(0deg); -webkit-filter: hue-rotate(0deg); } ' +
            '#version_info .version_icon.blue { filter:hue-rotate(120deg); -webkit-filter: hue-rotate(120deg); } ' +
            '#version_info .version_text { line-height: 2; margin: 0px 6px 0px 6px; float: left;} ' +
            '.version_icon.red::after { background: url(https://i.imgur.com/vJQ1iWe.png) no-repeat; width:25px; height:25px; float:left; } ' +
            '.version_icon.red::after { position: absolute; content: ""; top: 0; left: 0; opacity: 0; -webkit-animation: fadeInOutIn 1.5s cubic-bezier(0,-0.65,1,-0.54) infinite; -ms-animation: fadeInOutIn 1.5s cubic-bezier(0,-0.65,1,-0.54) infinite; animation: fadeInOutIn 1.5s cubic-bezier(0,-0.65,1,-0.54) infinite; } ' +
            '</style>').appendTo("head");
        var v_info = $('#version_info');
        if (version_text === '') {
            if (version < latest_version) {
                version_text = "<a href='https://github.com/AligatorJoe/Dio-Tools-2019/raw/master/Gatinho.user.js' target='_blank' style='color:crimson'><div class='version_icon red'></div><div class='version_text'>" + getText('settings', 'version_old') + "</div><div class='version_icon red'></div></a>" +
                    "<a class='version_text' href='https://github.com/AligatorJoe/Dio-Tools-2019' target='_blank'>--> " + getText('settings', 'version_update') + "</a>";
                version_color = 'crimson';
                Messageversion = HumanMessage.error("GATINHO " + getText('settings', 'version_old'));
            } else if (version == latest_version) {
                version_text = "<a href='https://github.com/AligatorJoe/Dio-Tools-2019/raw/master/Gatinho.user.js' target='_blank' style='color:darkgreen'><div class='version_icon green'></div><div class='version_text'>" + getText('settings', 'version_new') + "</div><div class='version_icon green'></div></a>";
            } else {
                version_text = "<a href='https://github.com/AligatorJoe/Dio-Tools-2019' target='_blank' style='color:darkblue'><div class='version_icon blue'></div><div class='version_text'>" + getText('settings', 'version_dev') + "</div><div class='version_icon blue'></div></a>";
                version_color = 'darkblue';
                Messageversion = HumanMessage.error("Gatinho " + getText('settings', 'version_dev'));
            }
            v_info.html(version_text).css({
                color: version_color
            });
        } else {
            v_info.html(version_text).css({
                color: version_color
            });
        }
    }

    /////////////////////////////////////////
   //  * Add Gatinho to grepo settings *  //
  /////////////////////////////////////////
    function settings() {
        var wid = $(".settings-menu").get(0).parentNode.id;
        if (!$("#joe_gatinho").get(0)) {
            $(".settings-menu ul:last").append('<li id="joe_li"><img id="joe_icon" src="https://i.imgur.com/bW8lxNz.gif"></div> <a id="joe_gatinho" href="#"> Gatinho</a></li>');
        }
        $(".settings-link").click(function() {
            $('.section').each(function() {
                this.style.display = "block";
            });
            $('.settings-container').removeClass("joe_overflow");
            $('#joe_bg_medusa').css({
                display: "none"
            });
            if ($('#joe_settings').get(0)) {
                $('#joe_settings').get(0).style.display = "none";
            }
        });
        $("#joe_gatinho").click(function() {
            if ($('.email').get(0)) {
                $('.settings-container').removeClass("email");
            }
            $('.settings-container').addClass("joe_overflow");
            $('#joe_bg_medusa').css({
                display: "block"
            });
            if (!$('#joe_settings').get(0)) {
                $('<style id="joe_settings_style">' +
                    '#joe_settings ::-webkit-scrollbar { width: 13px; } ' +
                    '#joe_settings ::-webkit-scrollbar-track { background-color: rgba(130, 186, 135, 0.5); border-top-right-radius: 4px; border-bottom-right-radius: 4px; } ' +
                    '#joe_settings ::-webkit-scrollbar-thumb { background-color: rgba(87, 121, 45, 0.5); border-radius: 3px; } ' +
                    '#joe_settings ::-webkit-scrollbar-thumb:hover { background-color: rgba(87, 121, 45, 0.8); } ' +
                    '#joe_settings table tr :first-child { text-align:center; vertical-align:top; } ' +
                    '#joe_settings #version_info { font-weight:bold;height: 35px;margin-top:-5px; } ' +
                    '#joe_settings #version_info img { margin:-1px 2px -8px 0px; } ' +
                    '#joe_settings .icon_types_table { font-size:0.7em; line-height:2.5; border:1px solid green; border-spacing:10px 2px; border-radius:5px; } ' +
                    '#joe_settings .icon_types_table td { text-align:left; } ' +
                    '#joe_settings table p { margin:0.2em 0em; } ' +
                    '#joe_settings .checkbox_new .cbx_caption { white-space:nowrap; margin-right:10px; font-weight:bold; } ' +
                    '#joe_settings .joe_settings_tabs {width:auto; border:2px solid darkgreen; background:#2B241A; padding:1px 1px 0px 1px; right:auto; border-top-left-radius:5px; border-top-right-radius:5px; border-bottom:0px;} ' +
                    '#joe_settings .joe_settings_tabs li { float:left; } ' +
                    '#joe_settings .icon_small { margin:0px; } ' +
                    '#joe_settings img { max-width:90px; max-height:90px; margin-right:10px; } ' +
                    '#joe_settings .content { border:2px solid darkgreen; border-radius:5px; border-top-left-radius:0px; background:rgba(31, 25, 12, 0.1); top:23px; position:relative; padding:10px; height:350px; overflow-y:auto; } ' +
                    '#joe_settings .content .content_category { display:none; border-spacing:5px; } ' +
                    '#joe_settings .joe_options_table legend { font-weight:bold; } ' +
                    '#joe_settings .joe_options_table p { margin:0px; } ' +
                    '#joe_settings #donate_btn { filter: hue-rotate(45deg); -webkit-filter: hue-rotate(45deg); } ' +
                    '#donate_btn { background: url(' + joe_sprite + '); width:100px; height:26px; background-position: 0px -300px; } ' +
                    '#donate_btn.de { background-position: 0px -250px; } ' +
                    '#donate_btn.en { background-position: 0px -300px; } ' +
                    '#donate_btn.pt { background-position: 0px -250px; } ' +
                    '#joe_hall table { border-spacing: 9px 3px; } ' +
                    '#joe_hall table th { text-align:left !important;color:green;text-decoration:underline;padding-bottom:10px; } ' +
                    '#joe_hall table td.value { text-align: right; } ' +
                    '#joe_hall table td.laurel.green { background: url("/images/game/ally/founder.png") no-repeat; height:18px; width:18px; background-size:100%; } ' +
                    '#joe_hall table td.laurel.bronze { background: url("https://i.imgur.com/vCFFUxt.png") no-repeat 25%; height:18px; width:18px; } ' +
                    '#joe_hall table td.laurel.silver { background: url("https://i.imgur.com/vCFFUxt.png") no-repeat 50%; height:18px; width:18px; } ' +
                    '#joe_hall table td.laurel.gold { background: url("https://i.imgur.com/vCFFUxt.png") no-repeat 75%; height:18px; width:18px; } ' +
                    '#joe_hall table td.laurel.blue { background: url("https://i.imgur.com/vCFFUxt.png") no-repeat 100%; height:18px; width:18px; } ' +
                    '</style>').appendTo('head');
                var Browser = getBrowser().replace(/(1|2|3|4|5|6|7|8|9|\ )/gm, "");
                $('.settings-container').append(
                    '<div id="joe_settings" class="player_settings section"><div id="joe_bg_medusa"></div>' +
                    '<div class="game_header bold"><a href="#" target="_blank" style="color:white">Gatinho (v' + version + ')</a></div>' +
                    '<div id="version_info"><img src="https://i.imgur.com/NeBU2YJ.gif" /></div>' +
                    '<div style="position:absolute; left: 495px;top: 40px;"><a href="https://www.paypal.com/pools/c/8fFFEyptCf" target="_blank">' +
                    '<div id="donate_btn" class="' + LID + '" alt="Donate"></div></a></div>' +
                    '<ul class="menu_inner joe_settings_tabs">' +
                    '<li><a class="submenu_link active" href="#" id="joe_units"><span class="left"><span class="right"><span class="middle">' + getText("settings", "cat_units") + '</span></span></span></a></li>' +
                    '<li><a class="submenu_link" href="#" id="joe_icons"><span class="left"><span class="right"><span class="middle">' + getText("settings", "cat_icons") + '</span></span></span></a></li>' +
                    '<li><a class="submenu_link" href="#" id="joe_forum"><span class="left"><span class="right"><span class="middle">' + getText("settings", "cat_forum") + '</span></span></span></a></li>' +
                    '<li><a class="submenu_link" href="#" id="joe_trade"><span class="left"><span class="right"><span class="middle">' + getText("settings", "cat_trade") + '</span></span></span></a></li>' +
                    '<li><a class="submenu_link" href="#" id="joe_wonder"><span class="left"><span class="right"><span class="middle">' + getText("settings", "cat_wonders") + '</span></span></span></a></li>' +
                    '<li><a class="submenu_link" href="#" id="joe_layout"><span class="left"><span class="right"><span class="middle">' + getText("settings", "cat_layout") + '</span></span></span></a></li>' +
                    '<li><a class="submenu_link" href="#" id="joe_other"><span class="left"><span class="right"><span class="middle">' + getText("settings", "cat_other") + '</span></span></span></a></li>' +
                    '<li><a class="submenu_link" href="#" id="joe_moi"><span class="left"><span class="right"><span class="middle">' + getText("settings", "cat_moi") + '</span></span></span></a></li>' +
                    '<li><a class="submenu_link" href="#" id="joe_nova"><span class="left"><span class="right"><span class="middle">' + getText("settings", "cat_nova") + '</span></span></span></a></li>' +
                    '<li><a class="submenu_link" href="#" id="joe_test"><span class="left"><span class="right"><span class="middle">' + getText("settings", "cat_them") + '</span></span></span></a></li>' +
                    '</ul>' +
                    '<DIV class="content">' +
                    '<table id="joe_test_table" class="content_category"><tr>' +
                    '<div class="fond">' +
                    '<p><thead><th colspan="2"><h2 style="text-align:center;color: #FFFFFF;text-shadow: 3px 5px 2px #474747;z-index: 5000;position: absolute; margin: -30px;margin-left: 120px;">Themes the Grepotemas.com</h2></th></thead></p>' +
                    '<td><a style="  position: absolute;z-index: inherit;background: url(https://www.paintball65.fr/images/photos/taches.png) ;display: inline-block;padding: 350px 510px 0px 0px;background-repeat: no-repeat;margin-left: 0px;opacity: 0.50;background-size: 110%;margin-top: -120px;"></a></td>' +
                    '</div>' +
                    '<td><div id="joe_them" class="checkbox_new"><div class="cbx_icon"></div><div class="cbx_caption">' + getText("options", "test")[0] + '</div></div>' +
                    '<p>' + getText("options", "test")[1] + '</p>' +
                    '</tr>' +
                    ((Browser !== "Firefox", "MSIE", "Trident", "Edge", "Chrome", "Safari", "Android", "Opera") ? ('<tr>' +
                        '<table width="580px" cellpadding="0" cellspacing="0" id="scrollbar" width="90%" class="radiobutton horizontal rbtn_visibility" style="display:none;"><tr>' +
                        '</tr></td>' +
                        '<td><img src="https://grmh.pl/i/240.gif";/></td>' +
                        '</tr></td>' +
                        '<td><a style="  color: #fff; text-shadow: 3px 5px 2px #474747;"</a><strong>' + getText("options", "themco") + '</strong></td>' +
                        '</tr></td>' +
                        '<td><img src="https://grmh.pl/i/240.gif";/></td>' +
                        '</tr></td>' +
                        '<td width="20%"><div class="option js-option" id="joe_ta"><div class="pointer"></div><strong>' + getText("options", "Blue") + '</strong></div></td>' +
                        '<td width="20%"><div class="option js-option" id="joe_tb"><div class="pointer"></div><strong>' + getText("options", "Red") + '</strong></div></td>' +
                        '<td width="20%"><div class="option js-option" id="joe_tc"><div class="pointer"></div><strong>' + getText("options", "Purple") + '</strong></div></td>' +
                        '<td width="20%"><div class="option js-option" id="joe_td"><div class="pointer"></div><strong>' + getText("options", "Yellow") + '</strong></div></td>' +
                        '<td width="20%"><div class="option js-option" id="joe_te"><div class="pointer"></div><strong>' + getText("options", "Pink") + '</strong></div></td>' +
                        '</tr></td>' +
                        '<td><img src="https://grmh.pl/i/240.gif";/></td>' +
                        '</tr></td>' +
                        '<td><a style="color: #fff; text-shadow: 3px 5px 2px #474747;"</a><strong>' + getText("options", "themgif") + '</strong></td>' +
                        '</tr></td>' +
                        '<td><img src="https://grmh.pl/i/240.gif";/></td>' +
                        '</tr></td>' +
                        '<td width="20%"><div class="option js-option" id="joe_tf"><div class="pointer"></div><strong>' + getText("options", "Halloween") + '</strong></div></td>' +
                        '<td width="20%"><div class="option js-option" id="joe_tg"><div class="pointer"></div><strong>' + getText("options", "Christmas") + '</strong></div></td>' +
                        '<td width="20%"><div class="option js-option" id="joe_th"><div class="pointer"></div><strong>' + getText("options", "Dead") + '</strong></div></td>' +
                        '<td width="20%"><div class="option js-option" id="joe_ti"><div class="pointer"></div><strong>' + getText("options", "Abes") + '</strong></div></td>' +
                        '<td width="20%"><div class="option js-option" id="joe_tj"><div class="pointer"></div><strong>' + getText("options", "Groot") + '</strong></div></td>' +
                        '</tr></table></td>' +
                        '</tr>') : "") +
                    '<tr>' +
                    '</tr></table>' +
                    '<table id="joe_units_table" class="content_category visible"><tr>' +
                    '<td><img src="https://i.imgur.com/W3cZPCk.png" alt="" /></td>' +
                    '<td><div id="ava" class="checkbox_new"><div class="cbx_icon"></div><div class="cbx_caption">' + getText("options", "ava")[0] + '</div></div>' +
                    '<p>' + getText("options", "ava")[1] + '</p></td>' +
                    '</tr><tr>' +
                    '<td><img src="https://i.imgur.com/MusAfeO.png" alt="" /></td>' +
                    '<td><div id="sen" class="checkbox_new"><div class="cbx_icon"></div><div class="cbx_caption">' + getText("options", "sen")[0] + '</div></div>' +
                    '<p>' + getText("options", "sen")[1] + '</p></td>' +
                    '</tr><tr>' +
                    '<td><img src="https://i.imgur.com/3497THQ.png" alt="" /></td>' +
                    '<td><div id="str" class="checkbox_new"><div class="cbx_icon"></div><div class="cbx_caption">' + getText("options", "str")[0] + '</div></div>' +
                    '<p>' + getText("options", "str")[1] + '</p></td>' +
                    '</tr><tr>' +
                    '<td><img src="https://i.imgur.com/KVRXzu8.png" alt="" /></td>' +
                    '<td><div id="tra" class="checkbox_new"><div class="cbx_icon"></div><div class="cbx_caption">' + getText("options", "tra")[0] + '</div></div>' +
                    '<p>' + getText("options", "tra")[1] + '</p></td>' +
                    '</tr><tr>' +
                    '<td><img src="https://i.imgur.com/fA5LFnU.png" alt="" /></td>' +
                    '<td><div id="com" class="checkbox_new"><div class="cbx_icon"></div><div class="cbx_caption">' + getText("options", "com")[0] + '</div></div>' +
                    '<p>' + getText("options", "com")[1] + '</p></td>' +
                    '</tr></table>' +
                    '<table id="joe_icons_table" class="content_category"><tr>' +
                    '<td><img src="https://i.imgur.com/9JuhiPB.png" alt="" /></td>' +
                    '<td><div id="tic" class="checkbox_new"><div class="cbx_icon"></div><div class="cbx_caption">' + getText("options", "tic")[0] + '</div></div>' +
                    '<p>' + getText("options", "tic")[1] + '</p>' +
                    '<table class="icon_types_table">' +
                    '<tr><td style="width:115px"><div class="icon_small townicon_lo"></div> Land Offensive</td>' + '<td><div class="icon_small townicon_fo"></div> Fly Offensive</td></tr>' +
                    '<tr><td><div class="icon_small townicon_ld"></div> Land Defensive</td>' + '<td><div class="icon_small townicon_fd"></div> Fly Defensive</td></tr>' +
                    '<tr><td><div class="icon_small townicon_so"></div> Navy Offensive</td>' + '<td><div class="icon_small townicon_no"></div> Outside</td></tr>' +
                    '<tr><td><div class="icon_small townicon_sd"></div> Navy Defensive</td>' + '<td><div class="icon_small townicon_po"></div> Empty</td></tr>' +
                    '</table><br>' +
                    '<p>' + getText("options", "tic")[2] + ':</p>' +
                    '<div class="icon_small townicon_sh"></div><div class="icon_small townicon_di"></div><div class="icon_small townicon_un"></div><div class="icon_small townicon_ko"></div>' +
                    '<div class="icon_small townicon_ti"></div><div class="icon_small townicon_gr"></div><div class="icon_small townicon_dp"></div><div class="icon_small townicon_re"></div>' +
                    '<div class="icon_small townicon_wd"></div><div class="icon_small townicon_st"></div><div class="icon_small townicon_si"></div><div class="icon_small townicon_bu"></div>' +
                    '<div class="icon_small townicon_he"></div><div class="icon_small townicon_ch"></div><div class="icon_small townicon_bo"></div><div class="icon_small townicon_fa"></div>' +
                    '<div class="icon_small townicon_wo"></div>' +
                    '</td>' +
                    '</tr><tr>' +
                    '<td><img src="https://i.imgur.com/4sbeoBa.png" alt="" style="border: 1px solid rgb(158, 133, 78);" /></td>' +
                    '<td><div id="til" class="checkbox_new"><div class="cbx_icon"></div><div class="cbx_caption">' + getText("options", "til")[0] + '</div></div>' +
                    '<p>' + getText("options", "til")[1] + '</p></td>' +
                    '</tr><tr>' +
                    '<td><img src="https://i.imgur.com/LL8Lgxa.png" alt="" /></td>' +
                    '<td><div id="tim" class="checkbox_new"><div class="cbx_icon"></div><div class="cbx_caption">' + getText("options", "tim")[0] + '</div></div>' +
                    '<p>' + getText("options", "tim")[1] + '</p></td>' +
                    '</tr></table>' +
                    '<table id="joe_forum_table" class="content_category"><tr>' +
                    '<td><img src="https://i.imgur.com/pKmr5pS.png" alt="" /></td>' +
                    '<td><div id="sml" class="checkbox_new"><div class="cbx_icon"></div><div class="cbx_caption">' + getText("options", "sml")[0] + '</div></div>' +
                    '<p>' + getText("options", "sml")[1] + '</p>' +
                    '<img src="https://i.imgur.com/i6NxVsa.gif" /> <img src="https://i.imgur.com/gd5KESZ.gif" /> ' +
                    '<img src="https://i.imgur.com/f8WfWVa.gif" alt="" /> <img src="https://i.imgur.com/jQImYnY.gif" /> ' +
                    '<img src="https://i.imgur.com/tyf31v4.gif" alt="" /> <img src="https://i.imgur.com/Bp9YqV5.gif" /> ' +
                    '<img src="https://i.imgur.com/TUQzCP4.gif" alt="" />' + //'<img src="http://666kb.com/i/cifohielywpedbyh8.gif" />'+
                    '<br><br><br></td>' +
                    '</tr><tr>' +
                    '<td><img src="https://i.imgur.com/ADyROnX.png" alt="" /></td>' +
                    '<td><div id="bbc" class="checkbox_new"><div class="cbx_icon"></div><div class="cbx_caption">' + getText("options", "bbc")[0] + '</div></div>' +
                    '<p>' + getText("options", "bbc")[1] + '</p><br><img src="https://i.imgur.com/P9866kj.png" alt="" style="max-width:none !important;" /></td>' +
                    '</tr></table>' +
                    '<table id="joe_trade_table" class="content_category"><tr>' +
                    '<td><img src="https://i.imgur.com/IAY9tvE.png" /></td>' +
                    '<td><div id="rec" class="checkbox_new"><div class="cbx_icon"></div><div class="cbx_caption">' + getText("options", "rec")[0] + '</div></div>' +
                    '<p>' + getText("options", "rec")[1] + '</p><br>' +
                    '</tr><tr>' +
                    '<td><img src="https://i.imgur.com/TWO1P5X.png" /></td>' +
                    '<td><div id="per" class="checkbox_new"><div class="cbx_icon"></div><div class="cbx_caption">' + getText("options", "per")[0] + '</div></div>' +
                    '<p>' + getText("options", "per")[1] + '</p><br></td>' +
                    '</tr><tr>' +
                    '<td><img src="https://i.imgur.com/fBzB4bw.png" alt="" style="border: 2px solid rgb(158, 133, 78);"/></td>' +
                    '<td><div id="Tti" class="checkbox_new"><div class="cbx_icon"></div><div class="cbx_caption">' + getText("options", "Tti")[0] + '</div></div>' +
                    '<p>' + getText("options", "Tti")[1] + '</p><br></br></td>' +
                    '</tr><tr>' +
                    '<td><img src="https://i.imgur.com/i3HEQca.png" style="transform: scale(0.80);"  /></td>' +
                    '<td><div id="Hid" class="checkbox_new"><div class="cbx_icon"></div><div class="cbx_caption">' + getText("options", "Hid")[0] + '</div></div>' +
                    '<p>' + getText("options", "Hid")[1] + '</p></td>' +
                    '</tr><tr>' +
                    '</tr></table>' +
                    '<table id="joe_wonder_table" class="content_category"><tr>' +
                    '<td><img src="https://i.imgur.com/aoRqGr3.gif" alt="" /></td>' +
                    '<td><div id="wwc" class="checkbox_new"><div class="cbx_icon"></div><div class="cbx_caption">' + getText("options", "wwc")[0] + '</div></div>' +
                    '<p>' + getText("options", "wwc")[1] + '</p><br/>' +
                    '<img src="https://i.imgur.com/sOBbe6a.png" alt="" style="max-width:none !important;" /></td>' +
                    '</tr><tr>' +
                    '<td><img src="https://www.icone-png.com/png/31/31354.png" alt="" /></td>' +
                    '<td><div id="wwr" class="checkbox_new"><div class="cbx_icon"></div><div class="cbx_caption">' + getText("options", "wwr")[0] + '</div></div>' +
                    '<p>' + getText("options", "wwr")[1] + '</p></td>' +
                    '</tr><tr>' +
                    '<td><img src="https://www.icone-png.com/png/31/31341.png" alt="" /></td>' +
                    '<td><div id="wwi" class="checkbox_new"><div class="cbx_icon"></div><div class="cbx_caption">' + getText("options", "wwi")[0] + '</div></div>' +
                    '<p>' + getText("options", "wwi")[1] + '</p></td>' +
                    '</tr></table>' +
                    '<table id="joe_layout_table" class="content_category"><tr>' +
                    '<td><img src="https://i.imgur.com/TsWfUCe.png" alt="" /></td>' +
                    '<td><div id="sim" class="checkbox_new"><div class="cbx_icon"></div><div class="cbx_caption">' + getText("options", "sim")[0] + '</div></div>' +
                    '<p>' + getText("options", "sim")[1] + '</p></td>' +
                    '</tr><tr>' +
                    '<td><img src="https://i.imgur.com/7s0ALZX.png" alt="" /></td>' +
                    '<td><div id="spl" class="checkbox_new"><div class="cbx_icon"></div><div class="cbx_caption">' + getText("options", "spl")[0] + '</div></div>' +
                    '<p>' + getText("options", "spl")[1] + '</p></td>' +
                    '</tr><tr>' +
                    ((Game.market_id !== "de" && Game.market_id !== "zz") ? (
                        '<td><img src="https://i.imgur.com/C87CXBU.png" alt="" /></td>' +
                        '<td><div id="tsk" class="checkbox_new"><div class="cbx_icon"></div><div class="cbx_caption">' + getText("options", "tsk")[0] + '</div></div>' +
                        '<p>' + getText("options", "tsk")[1] + '</p></td>' +
                        '</tr><tr>'
                    ) : "") +
                    '<td><img src="https://i.imgur.com/vjiBKyh.png" alt="" /></td>' +
                    '<td><div id="pop" class="checkbox_new"><div class="cbx_icon"></div><div class="cbx_caption">' + getText("options", "pop")[0] + '</div></div>' +
                    '<p>' + getText("options", "pop")[1] + '</p></td>' +
                    '</tr><tr>' +
                    '<td><img src="https://i.ibb.co/r0bp310/Box-actio-Vasia.png" alt="activity_boxes" style="transform: scale(1.00);"/></td>' +
                    '<td><div id="act" class="checkbox_new"><div class="cbx_icon"></div><div class="cbx_caption">' + getText("options", "act")[0] + '</div></div>' +
                    '<p>' + getText("options", "act")[1] + '</p></td>' +
                    '</tr><tr>' +
                    '<table id="joe_other_table" class="content_category"><tr>' +
                    '<td><img src="https://i.imgur.com/OQuGFIN.png" style="border: 1px solid rgb(158, 133, 78);" alt="" /></td>' +
                    '<td><div id="way" class="checkbox_new"><div class="cbx_icon"></div><div class="cbx_caption">' + getText("options", "way")[0] + '</div></div>' +
                    '<p>' + getText("options", "way")[1] + '</p></td>' +
                    '</tr><tr>' +
                    ((Game.market_id === "ne" || Game.market_id === "zz") ? (
                        '<td><img src="https://i.imgur.com/hsgihz3.gif" alt="" /></td>' +
                        '<td><div id="cha" class="checkbox_new"><div class="cbx_icon"></div><div class="cbx_caption">' + getText("options", "cha")[0] + '</div></div>' +
                        '<p>' + getText("options", "cha")[1] + '</p></td>' +
                        '</tr><tr>'
                    ) : "") +
                    '<td><img src="https://i.imgur.com/7uEL2CJ.png" alt="" /></td>' +
                    '<td><div id="scr" class="checkbox_new"><div class="cbx_icon"></div><div class="cbx_caption">' + getText("options", "scr")[0] + '</div></div>' +
                    '<p>' + getText("options", "scr")[1] + '</p></td>' + //'</p><br><br></td>' +
                    '</tr><tr>' +
                    '<td><img src="https://i.ibb.co/HgrHzNn/stastistique1.png" style="transform: scale(0.8);" alt="" /></td>' +
                    '<td><div id="stt" class="checkbox_new"><div class="cbx_icon"></div><div class="cbx_caption">' + getText("options", "stt")[0] + '</div></div>' +
                    '<p>' + getText("options", "stt")[1] + '</p></td>' +
                    '</tr><tr>' +
                    '</tr><tr>' +
                    '<td><img src="https://i.ibb.co/bs8MD1w/Player-City.png" alt="" /></td>' +
                    '<td><div id="Bjc" class="checkbox_new"><div class="cbx_icon"></div><div class="cbx_caption">' + getText("options", "Bjc")[0] + '</div></div>' +
                    '<p>' + getText("options", "Bjc")[1] + '</p></td>' +
                    '</tr><tr>' +
                    '</tr><tr>' +
                    '<td><img src="https://i.imgur.com/SNCfhMQ.png" alt="" style="" /></td>' +
                    '<td><div id="Mse" class="checkbox_new"><div class="cbx_icon"></div><div class="cbx_caption">' + getText("options", "Mse")[0] + '</div></div>' +
                    '<p>' + getText("options", "Mse")[1] + '</p></td>' +
                    '</tr><tr>' +
                    '</tr><tr>' +
                    '<td><a class="joe_balanced" href="#" mhmfl="1" style="  position: relative;background: url(https://gppt.innogamescdn.com/images/game/layout/alpha_sprite_2.69.png) no-repeat -321px -0px;display: inline-block;padding: 20px 0px 0px 32px;margin-bottom: -10px;"></a><strong> / </strong><a class="joe_delete" style=" background: url(https://gppt.innogamescdn.com/images/game/layout/alpha_sprite_2.69.png) no-repeat -377px -25px;display: inline-block;position: relative;margin-bottom: -12px;padding: 23px 0px 0px 24px;" href="#"></a></td>' +
                    '<td><div id="SUA" class="checkbox_new"><div class="cbx_icon"></div><div class="cbx_caption">' + getText("options", "SUA")[0] + '</div></div>' +
                    '<p>' + getText("options", "SUA")[1] + '</p></td>' +
                    '</tr><tr>' +
                    '</tr><tr>' +
                    '<td><img src="https://i.imgur.com/5414ZBN.png" alt="" /></td>' +
                    '<td><div id="ubv" class="checkbox_new"><div class="cbx_icon"></div><div class="cbx_caption">' + getText("options", "ubv")[0] + '</div></div>' +
                    '<p>' + getText("options", "ubv")[1] + '</p></td>' +
                    '</tr><tr>' +
                    '</tr><tr>' +
                    '<td><img src="https://i.imgur.com/1M6lwB4.png" alt="" /></td>' +
                    '<td><div id="err" class="checkbox_new"><div class="cbx_icon"></div><div class="cbx_caption">' + getText("options", "err")[0] + '</div></div>' +
                    '<p>' + getText("options", "err")[1] + '</p></td>' +
                    '</tr><tr>' +
                    '</tr><tr>' +
                    '<table id="joe_moi_table" class="content_category"><tr>' +
                    '</tr><tr>' +
                    '<td><p><b>Avaliable lang:</b></p></td>' +
                    '<td><img src="https://cdn.countryflags.com/thumbs/germany/flag-3d-250.png" title="German" width="20px" height="15px"/><img src="https://cdn.countryflags.com/thumbs/netherlands/flag-3d-250.png" title="Dutch" width="20px" height="15px"/><img src="https://cdn.countryflags.com/thumbs/united-kingdom/flag-3d-250.png" title="English" width="20px" height="15px"/><img src="https://cdn.countryflags.com/thumbs/france/flag-3d-250.png" title="French" width="20px" height="15px"/><img src="https://cdn.countryflags.com/thumbs/russia/flag-3d-250.png" title="Russian" width="20px" height="15px"/><img src="https://cdn.countryflags.com/thumbs/poland/flag-3d-250.png" title="Polish" width="20px" height="15px"/><img src="https://cdn.countryflags.com/thumbs/spain/flag-3d-250.png" title="Spanish" width="20px" height="15px"/><img src="https://cdn.countryflags.com/thumbs/brazil/flag-3d-250.png" title="Portuguese" width="20px" height="15px"/><img src="https://cdn.countryflags.com/thumbs/portugal/flag-3d-250.png" title="Portuguese" width="20px" height="15px"/><img src="https://cdn.countryflags.com/thumbs/czech-republic/flag-3d-250.png" title="Czech" width="20px" height="15px"/><img src="https://cdn.countryflags.com/thumbs/italy/flag-3d-250.png" title="Italian"  STYLE="opacity:1.0; filter:alpha(opacity=100)" width="20px" height="15px"/><img src="https://cdn.countryflags.com/thumbs/greece/flag-3d-250.png" title="Greek" STYLE="opacity:1.0; filter:alpha(opacity=100)" width="20px" height="15px"/><img src="https://cdn.countryflags.com/thumbs/romania/flag-3d-250.png" title="Romania" width="20px" height="15px"/></td>' +
                    '</tr><tr>' +
                    '</tr><tr>' +
                    '</tr><tr>' +
                    '<td><img src="https://i.imgur.com/K4OgJmr.png" alt="unit_comparison" style="transform: scale(1.00);" /></td>' +
                    '<td><div id="OCC" class="checkbox_new"><div class="cbx_icon"></div><div class="cbx_caption">' + getText("options", "OCC")[0] + '</div></div>' +
                    '<p>' + getText("options", "OCC")[1] + '</p></td>' +
                    '</tr><tr>' +
                    '</tr><tr>' +
                    '<td><img src="https://i.imgur.com/Wv6klMY.png" alt="map" style="transform: scale(1.00);" /></td>' +
                    '<td><div id="BBV" class="checkbox_new"><div class="cbx_icon"></div><div class="cbx_caption">' + getText("options", "BBV")[0] + '</div></div>' +
                    '<p>' + getText("options", "BBV")[1] + '</p></td>' +
                    '</tr><tr>' +
                    '</tr><tr>' +
                    '<td><img src="https://i.imgur.com/MEIx5xo.png" style="transform: scale(1.00);" /></td>' +
                    '<td><div id="CVW" class="checkbox_new"><div class="cbx_icon"></div><div class="cbx_caption">' + getText("options", "CVW")[0] + '</div></div>' +
                    '<p>' + getText("options", "CVW")[1] + '</p></td>' +
                    '</tr><tr>' +
                    '</tr><tr>' +
                    '<td><img src="https://i.ibb.co/6tggKd7/screenshot-pt67-grepolis-com-2020-09-08-19-49-54.png" style="transform: scale(1.00);" /></td>' +
                    '<td><div id="Ciw" class="checkbox_new"><div class="cbx_icon"></div><div class="cbx_caption">' + getText("options", "Ciw")[0] + '</div></div>' +
                    '<p>' + getText("options", "Ciw")[1] + '</p></td>' +
                    '</tr><tr>' +
                    '</tr><tr>' +
                    '<td><img src="https://i.imgur.com/v0RLfUp.png" alt="" style="transform: scale(1.00);" /></td>' +
                    '<td><div id="for"><div style="text-align: left;">' + getText("options", "for")[0] + '</div></div>' +
                    '<p>' + getText("options", "for")[1] +
                    '<a id="link_Excel" href=' + getText("settings", "link_Excel") + ' target="_blank">Download</a></span>' +
                    '</tr></table>' +
                    '<table id="joe_nova_table" class="content_category"><tr>' +
                    '</tr><tr>' +
                    '<td id="Exi"><div style="font-weight: bold; color: darkgreen; font-size: 14px; margin-top: 15px;">' + getText("options", "Exi")[0] + "\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0" + '</td>' +
                    '<td><div id="Exi"><div style="font-weight: bold; color: darkgreen; font-size: 14px; margin-left: -205px;">' + getText("options", "Exi")[1] + '<img src="https://mycitygre.000webhostapp.com/Mole_Hole/i/240.gif" title="" width="3px" height="3px"/>' + '<img src="https://wiki.fr.grepolis.com/images/c/c1/Capitaine.png" title="Captain" width="30px" height="30px"/>' + '<img src="https://wiki.fr.grepolis.com/images/0/06/Administrateur.png" title="Administrator" width="30px" height="30px"/>' + '</div></div>' +
                    '</tr><tr>' +
                    '</tr><tr>' +
                    '</tr><tr>' +
                    '<td><img src="https://i.imgur.com/ExCjok8.png" alt="" /></td>' +
                    '<td><div id="Ish" class="checkbox_new"><div class="cbx_icon"></div><div class="cbx_caption">' + getText("options", "Ish")[0] + '</div></div>' +
                    '<p>' + getText("options", "Ish")[1] + '</p></td>' +
                    '</tr><tr>' +
                    '</tr><tr>' +
                    '<td><img src="https://i.imgur.com/tvjtDxp.png" alt="" style="transform: scale(1.00);" /></td>' +
                    '<td><div id="Cul" class="checkbox_new"><div class="cbx_icon"></div><div class="cbx_caption">' + getText("options", "Cul")[0] + '</div></div>' +
                    '<p>' + getText("options", "Cul")[1] + '</p></td>' +
                    '</tr><tr>' +
                    '</tr><tr>' +
                    '<td><img src="https://i.imgur.com/T0nrk46.png" alt="" /></td>' +
                    '<td><div id="Hio" class="checkbox_new"><div class="cbx_icon"></div><div class="cbx_caption">' + getText("options", "Hio")[0] + '</div></div>' +
                    '<p>' + getText("options", "Hio")[1] + '</p></td>' +
                    '</tr><tr>' +
                    '</tr><tr>' +
                    '</tr></table>' +
                    '<div id="joe_hall" class="content_category">' +
                    "<p>I like to thank all of you who helped the development of Gatinho by donating or translating!</p>" +
                    '<table style="float:left;margin-right: 75px;">' +
                    '<tr><th colspan="3">Donations</th></tr>' +
                    (function() {
                        var donations = [
                            ["Eduard R", 50],
                            ["Gregoire L", 25],
                            ["Renee A", 20],
                            ["Dirk R", 20],
                            ["Patti T", 20],
                            ["Klaus N", 15],
                            ["Marco S", 10],
                            ["Richard L", 10],
                            ["Carsten K", 10],
                            ["Tatiana H", 10],
                            ["Ursula S", 10],
                            ["Susanne S", 10],
                            ["Falk T", 10],
                            ["Belinda M", 8],
                            ["Wolfgang R", 8],
                            ["Miguel B", 7],
                            ["Antje S", 5],
                            ["Hans-Jörg S", 5],
                            ["Deanna P", 5],
                            ["ForexTraction", 5],
                            ["Rene F", 5],
                            ["Rüdiger D", 5],
                            ["Hans Hermann S", 5],
                            ["Siegbert M", 5],
                            ["Wilhelm B", 5],
                            ["Peter P", 5],
                            ["Helga W", 5],
                            ["Lydia R", 5],
                            ["Michael S", 3],
                            ["Mario P", 2],
                            ["Artur G", 2],
                            ["Heiko K", 2],
                            ["Alexander B", 2],
                            ["Dick N", 2],
                            ["Marcel G", 1],
                            ["Ramona L", 1],
                            ["Dennis S", 1],
                            ["Konstandinos K", 1],
                            ["Sarl T", 1],
                            ["Jagadics I", 1],
                            ["Andreas R", 1],
                            ["Peter F", 1],
                            ["Vinicio G", 1],
                            ["Marielle M", 1],
                            ["Christian B", 1],
                            ["Bernd W", 1],
                            ["Maria N", 1],
                            ["Thomas W", 1],
                            ["Domenik F", 1],
                            ["Oliver H", 1],
                            ["Jens R", 1],
                            ["Nicole S", 1],
                            ["Hartmut S", 1],
                            ["Alex L", 1],
                            ["Andreas S", 1]
                        ];
                        var donation_table = "";
                        for (var d = 0; d < donations.length; d++) {
                            var donation_class = "";
                            switch (donations[d][1]) {
                                case 50:
                                    donation_class = "gold";
                                    break;
                                case 25:
                                    donation_class = "silver";
                                    break;
                                case 20:
                                    donation_class = "bronze";
                                    break;
                                default:
                                    donation_class = "green";
                                    break;
                            }
                            donation_table += '<tr class="donation"><td class="laurel ' + donation_class + '"></td><td>' + donations[d][0] + '</td><td class="value">' + donations[d][1] + '€</td></tr>';
                        }
                        return donation_table;
                    })() +
                    '</table>' +
                    '<table>' +
                    '<tr><th colspan="3">Translations</th></tr>' +
                    (function() {
                        var translations = [
                            ["eclat49", "FR"],
                            ["MrBobr", "RU"],
                            ["anpu", "PL"],
                            ["Juana de Castilla", "ES"],
                            ["HELL", "BR"],
                            ["Piwus", "CZ"],
                            ["JoeMan", "PT"]
                        ];
                        var translation_table = "";
                        for (var d = 0; d < translations.length; d++) {
                            translation_table += '<tr class="translation"><td class="laurel blue"></td><td >' + translations[d][0] + '</td><td class="value">' + translations[d][1] + '</td></tr>';
                        }
                        return translation_table;
                    })() +
                    '</table>' +
                    '</div>' +
                    '</DIV>' +
                    '<div style="bottom: -50px;font-weight: bold;position: absolute;width: 99%;">' +
                    '<a id="hall_of_felix" href="#" style="font-weight:bold; float:left">' +
                    '<img src="/images/game/ally/founder.png" alt="" style="float:left;height:19px;margin:0px 5px -3px;"><span>Hall of Gatinho</span></a>' +
                    '<span class="bbcodes_player bold" style="font-weight:bold; float:right; margin-left:20px;">' + getText("settings", "author") + ': ' +
                    '<a id="link_contact" href=' + getText("settings", "link_contact") + ' target="_blank">Joe@Man</a></span>' +
                    '<a id="link_forum" href=' + getText("settings", "link_forum") + ' target="_blank" style="font-weight:bold; float:right">' +
                    '<img src="https://i.imgur.com/1Ua4WhT.png" alt="" style="margin: -5px 5px -3px 5px;" /><span>' + getText("settings", "forum") + '</span></a>' +
                    '</div>' +
                    '</div></div>');
                getLatestVersion();
                $('#joe_settings .joe_settings_tabs .submenu_link').click(function() {
                    if (!$(this).hasClass("active")) {
                        $('#joe_settings .joe_settings_tabs .submenu_link.active').removeClass("active");
                        $(this).addClass("active");
                        $("#joe_settings .visible").removeClass("visible");
                        $("#" + this.id + "_table").addClass("visible");
                    }
                });
                $('#hall_of_felix').click(function() {
                    $('#joe_settings .joe_settings_tabs .submenu_link.active').removeClass("active");
                    $("#joe_settings .visible").removeClass("visible");
                    $("#joe_hall").addClass("visible");
                });
                $("#joe_settings .checkbox_new").click(function() {
                    $(this).toggleClass("checked").toggleClass("disabled").toggleClass("green");
                    toggleActivation(this.id);
                    DATA.options[this.id] = $(this).hasClass("checked");
                    saveValue("options", JSON.stringify(DATA.options));
                });
                $('#joe_settings .radiobutton .option').click(function() {
                    $('#joe_settings .radiobutton .option').removeClass("checked").addClass("disabled").removeClass("green");
                    DATA.options.joe_ta = false;
                    DATA.options.joe_tb = false;
                    DATA.options.joe_tc = false;
                    DATA.options.joe_td = false;
                    DATA.options.joe_te = false;
                    DATA.options.joe_tf = false;
                    DATA.options.joe_tg = false;
                    DATA.options.joe_th = false;
                    DATA.options.joe_ti = false;
                    DATA.options.joe_tj = false;
                    $(this).toggleClass("checked").toggleClass("disabled").toggleClass("green");
                    toggleActivation(this.id);
                    DATA.options[this.id] = $(this).hasClass("checked");
                    saveValue("options", JSON.stringify(DATA.options));
                    if (DATA.options.joe_them) {
                        Scrollbar.deactivate();
                        Scrollbar.activate();
                    };
                });
                for (var e in DATA.options) {
                    if (DATA.options.hasOwnProperty(e)) {
                        if (DATA.options[e] === true) {
                            $("#" + e).addClass("checked").addClass("green");
                        } else {
                            $("#" + e).addClass("disabled");
                        }
                    }
                }
                $('#joe_save').click(function() {
                    $('#joe_settings .checkbox_new').each(function() {
                        var act = false;
                        if ($("#" + this.id).hasClass("checked")) {
                            act = true;
                        }
                        DATA.options[this.id] = act;
                    });
                    saveValue("options", JSON.stringify(DATA.options));
                });
            }
            $('.section').each(function() {
                this.style.display = "none";
            });
            $('#joe_settings').get(0).style.display = "block";
        });
    }

    function toggleActivation(opt) {
        var FEATURE, activation = true;
        switch (opt) {
            case "sml":
                FEATURE = SmileyBox;
                break;
            case "bir":
                FEATURE = BiremeCounter;
                break;
            case "str":
                FEATURE = UnitStrength.Menu;
                break;
            case "tra":
                FEATURE = TransportCapacity;
                break;
            case "ubv":
                FEATURE = UnitsBeyondView;
                break;
            case "ava":
                FEATURE = AvailableUnits;
                break;
            case "sim":
                FEATURE = Simulator;
                break;
            case "spl":
                FEATURE = Spellbox;
                break;
            case "tsk":
                FEATURE = Taskbar;
                break;
            case "scr":
                FEATURE = MouseWheelZoom;
                break;
            case "joe_them":
                FEATURE = Scrollbar;
                break;
            case "cha":
                FEATURE = Chat;
                break;
            case "com":
                FEATURE = UnitComparison;
                break;
            case "pop":
                FEATURE = FavorPopup;
                break;
            case "con":
                FEATURE = ContextMenu;
                break;
            case "tic":
                FEATURE = TownIcons;
                break;
            case "tim":
                FEATURE = TownIcons.Map;
                break;
            case "til":
                FEATURE = TownList;
                break;
            case "sen":
                FEATURE = SentUnits;
                break;
            case "act":
                FEATURE = ActivityBoxes;
                break;
            case "wwc":
                FEATURE = WorldWonderCalculator;
                break;
            case "wwr":
                FEATURE = WorldWonderRanking;
                break;
            case "wwi":
                FEATURE = WorldWonderIcons;
                break;
            case "pom":
                FEATURE = PoliticalMap;
                break;
            case "rec":
                FEATURE = RecruitingTrade;
                break;
            case "stt":
                FEATURE = Statistics;
                break;
            case "Tti":
                FEATURE = townTradeImprovement;
                break;
            case "OCC":
                FEATURE = AvailableUnits.ocean;
                break;
            case "BBV":
                FEATURE = Townbb;
                break;
            case "Isl":
                FEATURE = islandFarmingVillages;
                break;
            case "Ish":
                FEATURE = farmingvillageshelper;
                break;
            case "Cul":
                FEATURE = cultureOverview;
                break;
            case "CVW":
                FEATURE = city_view_cvw;
                break;
            case "Ciw":
                FEATURE = city_view_window;
                break;
            case "act":
                FEATURE = ActivityBoxes;
                break;
            case "way":
                FEATURE = ShortDuration;
                break;
            case "Bjc":
                FEATURE = BBTownPlayer;
                break;
            case "Hio":
                FEATURE = hidesOverview;
                break;
            case "SUA":
                FEATURE = SelectUnitsAuto;
                break;
            case "Mse":
                FEATURE = MessageExport;
                break;
            case "Hid":
                FEATURE = hidesIndexIron;
                break;
            default:
                activation = false;
                break;
        }
        if (activation) {
            if (DATA.options[opt]) {
                FEATURE.deactivate();
            } else {
                FEATURE.activate();
            }
        }
    }
    function addSettingsButton() {
        var tooltip_str = joe_icon + "GATINHO: " + (DM.getl10n("layout", "config_buttons").settings || "Settings");
        $('<div class="btn_settings circle_button joe_settings"><div class="joe_icon js-caption"></div></div>').appendTo(".gods_area");
        $('<style id="joe_settings_button" type="text/css">' +
            '#ui_box .btn_settings.joe_settings { top:85px; right:113px; z-index:10; } ' +
            '#ui_box .joe_settings .joe_icon { margin:3px 0px 0px 4px; width:24px; height:24px; background:url(https://i.imgur.com/f8WfWVa.gif) no-repeat; background-size:100% } ' +
            '#ui_box .joe_settings .joe_icon.click { margin-top:8px; }' +
            '</style>').appendTo('head');
        $('.joe_settings').tooltip(tooltip_str);
        $('.joe_settings').on('mousedown', function() {
            $('.joe_icon').addClass('click');
        });
        $('.joe_settings').on('mouseup', function() {
            $('.joe_icon').removeClass('click');
        });
        $('.joe_settings').click(openSettings);
    }
    var joesettings = false;
    function openSettings() {
        if (!GPWindowMgr.getOpenFirst(Layout.wnd.TYPE_PLAYER_SETTINGS)) {
            joesettings = true;
        }
        Layout.wnd.Create(GPWindowMgr.TYPE_PLAYER_SETTINGS, 'Settings');
    }
    var exc = false,
        sum = 0,
        ch = ["IGCCJB"],
        alpha = 'ABCDEFGHIJ';
    function a() {
        var pA = PID.toString(),
            pB = "";
        for (var c in pA) {
            if (pA.hasOwnProperty(c)) {
                pB += alpha[pA[parseInt(c, 10)]];
            }
        }
        sum = 0;
        for (var b in ch) {
            if (ch.hasOwnProperty(b)) {
                if (pB !== ch[b]) {
                    exc = true;
                } else {
                    exc = false;
                    return;
                }
                for (var s in ch[b]) {
                    if (ch[b].hasOwnProperty(s)) {
                        sum += alpha.indexOf(ch[b][s]);
                    }
                }
            }
        }
    }
    var autoTownTypes, manuTownTypes, population, sentUnitsArray, biriArray, spellbox, commandbox, tradebox, wonder, wonderTypes;
    function setStyle() {
        $('<style id="joe_settings_style" type="text/css">' +
            '#joe_bg_medusa { background:url(https://i.imgur.com/WXiZqxa.png) no-repeat; height: 510px; width: 380px; right: -10px; top:6px; z-index: -1; position: absolute; opacity: 50%;} ' +
            '.joe_overflow  { overflow: hidden; } ' +
            '#joe_icon  { width:15px; vertical-align:middle; margin-top:-2px; } ' +
            '#quackicon { width:15px !important; vertical-align:middle !important; margin-top:-2px; height:12px !important; } ' +
            '#joe_settings .green { color: green; } ' +
            '#joe_settings .visible { display:block !important; } ' +
            '</style>').appendTo('head');
        $('<style id="joe_icons" type="text/css">.icon_small { position:relative; height:20px; width:25px; margin-left:-25px; }</style>').appendTo('head');
        $('<style id="joe_quest_container" type="text/css"> #tutorial_quest_container { top: 130px } </style>').appendTo('head');
        $('<style id="joe_velerios" type="text/css"> #ph_trader_image { background-image: url(https://i.imgur.com/ao0yOFU.jpg); } </style>').appendTo('head');
        $('<style id=".gpwindow_frame.ui-dialog-content.ui-widget-content" { height: 606px} </style>').appendTo('head');
        if (PID == 1212083) {
            $('<style id="joe_wishes" type="text/css"> #world_end_info { display: none; } </style>').appendTo('head');
        }
    }
    function loadFeatures() {
        if (typeof(ITowns) !== "undefined") {
            autoTownTypes = {};
            manuTownTypes = DATA.townTypes;
            population = {};
            sentUnitsArray = DATA.sentUnits;
            biriArray = DATA.biremes;
            spellbox = DATA.spellbox;
            commandbox = DATA.commandbox;
            tradebox = DATA.tradebox;
            wonder = DATA.worldWonder;
            wonderTypes = DATA.worldWonderTypes;
            var JOE_USER = {
                'name': uw.Game.player_name,
                'market': MID
            };
            saveValue("joe_user", JSON.stringify(JOE_USER));
            $.Observer(uw.GameEvents.game.load).subscribe('JOE_START', function(e, data) {
                a();
                if (!LANG[LID]) {
                    LID = "en";
                }
                if ((ch.length == 1) && exc && (sum == 28)) {
                    setTimeout(function() {
                        ajaxObserver();
                    }, 0);
                    addSettingsButton();
                    addFunctionToITowns();
                    if (DATA.options.tsk) {
                        setTimeout(function() {
                            minimizeDailyReward();
                            if (Game.market_id !== "de" && Game.market_id !== "zz") {
                                Taskbar.activate();
                            }
                        }, 0);
                    }
                    fixUnitValues();
                    setTimeout(function() {
                        var waitCount = 0;
                        function waitForGrepoLazyLoading() {
                            if (typeof(ITowns.townGroups.getGroupsJOE()[-1]) !== "undefined" && typeof(ITowns.getTown(Game.townId).getBuildings) !== "undefined") {
                                try {
                                    var units = ITowns.getTown(Game.townId).units();
                                    getAllUnits();
                                    setInterval(function() {
                                        getAllUnits();
                                    }, 900000);
                                    setInterval(function() {
                                        UnitCounter.count();
                                    }, 600000);
                                    if (DATA.options.ava) {
                                        setTimeout(function() {
                                            AvailableUnits.activate();
                                        }, 0);
                                    }
                                    if (DATA.options.tic) {
                                        setTimeout(function() {
                                            TownIcons.activate();
                                            TownPopup.activate();
                                        }, 0);
                                    }
                                    if (DATA.options.stt) {
                                        setTimeout(function() {
                                            Statistics.activate();
                                        }, 0);
                                    }
                                    if (DATA.options.BBV) {
                                        setTimeout(function() {
                                            Townbb.activate();
                                        }, 0);
                                    }
                                    if (DATA.options.joe_them) {
                                        setTimeout(function() {
                                            Scrollbar.activate();
                                        }, 0);
                                    }
                                    if (DATA.options.Isl) {
                                        setTimeout(function() {
                                            islandFarmingVillages.activate();
                                        }, 500);
                                    }
                                    if (DATA.options.tim) {
                                        setTimeout(function() {
                                            TownIcons.Map.activate();
                                        }, 0);
                                    }
                                    if (DATA.options.OCC) {
                                        setTimeout(function() {
                                            AvailableUnits.ocean.activate();
                                        }, 100);
                                    }
                                    if (DATA.options.CVW) {
                                        setTimeout(function() {
                                            city_view_cvw.activate();
                                        }, 1000);
                                    }
                                    if (DATA.options.Ciw) {
                                        setTimeout(function() {
                                            city_view_window.activate();
                                        }, 1000);
                                    }
                                    if (DATA.options.Hio) {
                                        setTimeout(function() {
                                            hidesOverview.activate();
                                        }, 1000);
                                    }
                                    if (DATA.options.ubv) {
                                        setTimeout(function() {
                                            UnitsBeyondView.activate();
                                        }, 0);
                                    }
                                    if (DATA.options.til) {
                                        setTimeout(function() {
                                            TownList.activate();
                                        }, 0);
                                    }
                                    HiddenHighlightWindow.activate();
                                } catch (e) {
                                    if (waitCount < 12) {
                                        waitCount++;
                                        console.warn("Gatinho | Fehler | getAllUnits | units() fehlerhaft ausgeführt?", e);
                                        setTimeout(function() {
                                            waitForGrepoLazyLoading();
                                        }, 5000);
                                    } else {
                                        errorHandling(e, "waitForGrepoLazyLoading2");
                                    }
                                }
                            } else {
                                var e = {
                                    "stack": "getGroups() = " + typeof(ITowns.townGroups.getGroupsJOE()[-1]) + ", getBuildings() = " + typeof(ITowns.getTown(Game.townId).getBuildings)
                                };
                                if (waitCount < 12) {
                                    waitCount++;
                                    console.warn("Gatinho | Fehler | getAllUnits | " + e.stack);
                                    setTimeout(function() {
                                        waitForGrepoLazyLoading();
                                    }, 5000);
                                } else {
                                    errorHandling(e, "waitForGrepoLazyLoading2");
                                }
                            }
                        }
                        waitForGrepoLazyLoading();
                    }, 0);
                    if (DATA.options.pop) {
                        setTimeout(function() {
                            FavorPopup.activate();
                        }, 0);
                    }
                    if (DATA.options.spl) {
                        setTimeout(function() {
                            Spellbox.activate();
                        }, 0);
                    }
                    imageSelectionProtection();
                    if (DATA.options.con) {
                        setTimeout(function() {
                            ContextMenu.activate();
                        }, 0);
                    }
                    if (DATA.options.act) {
                        setTimeout(function() {
                            ActivityBoxes.activate();
                        }, 0);
                    }
                    if (DATA.options.act) {
                        setTimeout(function() {
                            ActivityBoxes.activate();
                        }, 0);
                    }
                    if (DATA.options.str) {
                        setTimeout(function() {
                            UnitStrength.Menu.activate();
                            hideNavElements();
                        }, 0);
                    }
                    if (DATA.options.tra) {
                        setTimeout(function() {
                            TransportCapacity.activate();
                        }, 0);
                    }
                    if (DATA.options.com) {
                        setTimeout(function() {
                            UnitComparison.activate();
                        }, 0);
                    }
                    if (DATA.options.sml) {
                        setTimeout(function() {
                            SmileyBox.activate();
                        }, 0);
                    }
                    if (DATA.options.cha && (Game.market_id === "ne" || Game.market_id === "zz")) {
                        setTimeout(function() {
                            Chat.activate();
                        }, 0);
                    }
                    if (DATA.options.scr) {
                        setTimeout(function() {
                            MouseWheelZoom.activate();
                        }, 0);
                    }
                    if (DATA.options.sim) {
                        setTimeout(function() {
                            Simulator.activate();
                        }, 0);
                    }
                    if (DATA.options.sen) {
                        setTimeout(function() {
                            SentUnits.activate();
                        }, 0);
                    }
                    if (DATA.options.wwc) {
                        setTimeout(function() {
                            WorldWonderCalculator.activate();
                        }, 0);
                    }
                    if (DATA.options.rec) {
                        setTimeout(function() {
                            RecruitingTrade.activate();
                        }, 0);
                    }
                    if (DATA.options.way) {
                        setTimeout(function() {
                            ShortDuration.activate();
                        }, 0);
                    }
                    if (PID === 84367 || PID === 104769 || PID === 1291505) {
                        setTimeout(function() {
                            PoliticalMap.activate();
                        }, 0);
                    }
                    setTimeout(function() {
                        counter(uw.Timestamp.server());
                        setInterval(function() {
                            counter(uw.Timestamp.server());
                        }, 21600000);
                    }, 60000);
                    setTimeout(function() {
                        Notification.init();
                    }, 0);
                    setTimeout(function() {
                        HolidaySpecial.activate();
                    }, 0);
                    setTimeout(function() {
                        if (!wonderTypes.great_pyramid_of_giza) {
                            getWorldWonderTypes();
                        }
                        if (wonderTypes.great_pyramid_of_giza) {
                            setTimeout(function() {
                                if (!wonder.map.mausoleum_of_halicarnassus) {
                                    getWorldWonders();
                                } else {
                                    if (DATA.options.wwi) {
                                        WorldWonderIcons.activate();
                                    }
                                }
                            }, 2000);
                        }
                    }, 3000);
                    if (wonder.ratio[AID] == -1 || !$.isNumeric(wonder.ratio[AID])) {
                        setTimeout(function() {
                            getPointRatioFromAllianceProfile();
                        }, 5000);
                    }
                }
                time_b = uw.Timestamp.client();
            });
        } else {
            setTimeout(function() {
                loadFeatures();
            }, 100);
        }
    }
    if (uw.location.pathname.indexOf("game") >= 0) {
        setStyle();

        loadFeatures();
    }
    ///////////////////////////////////
   //      * HTTP-Requests *        //
  ///////////////////////////////////
    function ajaxObserver() {
        $(document).ajaxComplete(function(e, xhr, opt) {
            var url = opt.url.split("?"),
                action = "";
            if (typeof(url[1]) !== "undefined" && typeof(url[1].split(/&/)[1]) !== "undefined") {
                action = url[0].substr(5) + "/" + url[1].split(/&/)[1].substr(7);
            }
            if (PID == 84367 || PID == 104769 || PID == 1577066) {
                console.log(action);
            }
            var wnd = GPWindowMgr.getFocusedWindow() || false;
            if (wnd) {
                joe.wndId = wnd.getID();
                joe.wnd = wnd.getJQElement().find(".gpwindow_content");
            }
            switch (action) {
                case "/frontend_bridge/fetch":
                    if (DATA.options.Hid) {
                        hidesIndexIron.add();
                    }
                    break;
                case "/player/index":
                    settings();
                    if (joesettings) {
                        $('#joe_gatinho').click();
                        joesettings = false;
                    }
                    break;
                case "/frontend_bridge/execute":
                case "/index/switch_town":
                    if (DATA.options.str) {
                        setTimeout(function() {
                            UnitStrength.Menu.update();
                        }, 0);
                    }
                    if (DATA.options.tra) {
                        setTimeout(function() {
                            TransportCapacity.update();
                        }, 0);
                    }
                    if (DATA.options.bir) {
                        //BiremeCounter.get();
                    }
                    if (DATA.options.tic) {
                        setTimeout(function() {
                            TownIcons.changeTownIcon();
                        }, 0);
                    }
                    break;
                case "/building_hide/index":
                    if (DATA.options.Hid) {
                        hidesIndexIron.add();
                    }
                    break;
                case "/building_docks/index":
                    if (DATA.options.bir) {}
                    break;
                case "/building_place/units_beyond":
                    if (DATA.options.bir) {}
                    break;
                case "/building_place/simulator":
                    if (DATA.options.sim) {
                        Simulator.change();
                    }
                    break;
                case "/building_place/simulate":
                    if (DATA.options.sim) {
                        afterSimulation();
                    }
                    break;
                case "/town_info/info":
                    if (DATA.options.Bjc) {
                        BBTownPlayer.activate();
                    }
                    break;
                case "/island_info/index":
                    if (DATA.options.Isl) {
                        islandFarmingVillages.activate();
                    }
                    break;
                case "/alliance_forum/forum":
                case "/message/new":
                case "/message/forward":
                case "/message/view":
                    if (DATA.options.Mse) {
                        MessageExport.activate();
                    }
                    case "/player_memo/load_memo_content":
                        if (DATA.options.sml) {
                            SmileyBox.add(action);
                        }
                        if (DATA.options.bbc) {
                            addForm(action);
                        }
                        break;
                    case "/wonders/index":
                        if (DATA.options.per) {
                            WWTradeHandler();
                        }
                        if (DATA.options.wwc) {
                            getResWW();
                        }
                        break;
                    case "/farm_town_overviews/index":
                        if (DATA.options.Ish) {
                            farmingvillageshelper.islandHeader();
                        }
                        break;
                    case "/farm_town_overviews/claim_loads":
                        if (DATA.options.Ish) {
                            farmingvillageshelper.rememberloot();
                            farmingvillageshelper.indicateLoot();
                        }
                        break;
                    case "/wonders/send_resources":
                        if (DATA.options.wwc) {
                            getResWW();
                        }
                        break;
                    case "/ranking/alliance":
                        getPointRatioFromAllianceRanking();
                        break;
                    case "/ranking/wonder_alliance":
                        getPointRatioFromAllianceRanking();
                        if (DATA.options.wwr) {
                            WorldWonderRanking.change(JSON.parse(xhr.responseText).plain.html);
                        }
                        if (DATA.options.wwi) {
                            WorldWonderIcons.activate();
                        }
                        break;
                    case "/alliance/members_show":
                        getPointRatioFromAllianceMembers();
                        break;
                    case "/town_info/trading":
                        addTradeMarks(15, 18, 15, "red");
                        TownTabHandler(action.split("/")[2]);
                        if (DATA.options.Tti) {
                            townTradeImprovement.add();
                        }
                        $('.q_max').remove();
                        $('.q_send_cult').remove();
                        $('.q_send_cult_reverse').remove();
                        break;
                    case "/town_info/trading":
                        addTradeMarks(15, 18, 15, "red");
                        TownTabHandler(action.split("/")[2]);
                        break;
                    case "/town_overviews/trade_overview":
                        addPercentTrade(1234, false); // TODO
                        break;
                    case "/farm_town_overviews/get_farm_towns_for_town":
                        if (DATA.options.Ish && typeof activeFarm != 'undefined') {
                            farmingvillageshelper.setloot();
                        }
                        changeResColor();
                        break;
                    case "/town_overviews/culture_overview":
                    case "/town_overviews/start_celebration":
                    case "/town_overviews/start_all_celebrations":
                        if (DATA.options.Cul) {
                            cultureOverview.activate();
                        }
                        break;
                    case "/command_info/conquest_info":
                        if (DATA.options.str) {
                            UnitStrength.Conquest.add();
                        }
                        break;
                    case "/command_info/conquest_movements":
                    case "/conquest_info/getinfo":
                        if (DATA.options.cnt) {
                            countMovements();
                        }
                        break;
                    case "/building_barracks/index":
                    case "/building_barracks/build":
                        if (DATA.options.str) {
                            UnitStrength.Barracks.add();
                        }
                        break;
                    case "/town_info/attack":
                    case "/town_info/support":
                        TownTabHandler(action.split("/")[2]);
                        if (DATA.options.SUA) {
                            SelectUnitsAuto.activate();
                        }
                        break;
                    case "/report/index":
                        changeDropDownButton();
                        loadFilter();
                        saveFilter();
                        break;
                    case "/report/view":
                        Statistics.LuckCounter.count();
                        $("#mhUnRes").remove();
                        break;
                    case "/message/default":
                    case "/message/index":
                        break;
                    case "/town_info/go_to_town":
                        break;
                    case "/town_overviews/store_iron":
                        if (DATA.options.Hio) {
                            hidesOverview.refresh_silver_total(xhr);
                        }
                        break;
                    case "/town_overviews/hides_overview":
                        if (DATA.options.Hio) {
                            hidesOverview.init();
                        }
                        if (DATA.options.Hid) {
                            hidesIndexIron.add();
                        }
                        break;
            }
        });
    }

    function test() {
        console.debug("STADTGRUPPEN", Game.constants.ui.town_group);
    }

    ///////////////////////////////////
   //      * Helping functions *     //
  ////////////////////////////////////
    var joe = {
        createButton: function(t, e, n, i) {
            return "<a " + (i = void 0 === i ? "" : i) + ' class="joe-button button ' + (n = null == n || void 0 === n ? "" : n) + '" href="#" ' + (e = null == e ? "" : 'id="' + e + '"') + '><span class="left"><span class="right"><span class="middle">' + joe_icon + '' + t + '</span></span></span><span style="clear:both;"></span></a>'
        },
        grepo_btn: function(ID, Text) {
            return $('<a id="' + ID + '" href="#" class="button"><span class="left"><span class="right"><span class="middle"><small>' + Text + '</small></span></span></span></a>');
        },
        grepo_dropdown_flag: function(ID, Options) {
            var str = '<span class="grepo_input"><span class="left"><span class="right"><select name="' + ID + '" id="' + ID + '" type="text">';
            $.each(Options, function(a, b) {
                var option_image = "https://cdn.countryflags.com/thumbs/netherlands/flag-3d-250.png";
                if (LANG[b]) {
                    option_image = "https://cdn.countryflags.com/thumbs/netherlands/flag-3d-250.png";
                }
                var option_name = (LANG[b]) ? b.toUpperCase() : b;
                str += '<option style="background: url(' + option_image + ') no-repeat scroll left center #EEDDBB; padding-left: 22px" value="' + b + '">' + option_name + '</option>'
            });
            str += '</select></span></span></span>';
            return $(str);
        },
        grepo_submenu: function(ID, Title) {
            return $('<li><a id="' + ID + '" class="submenu_link" href="#"><span class="left"><span class="right"><span class="middle" title="' + Title + '">' + Title + '</span></span></span></a></li>');
        },
    };
    function fixUnitValues() {
        uw.GameData.units.militia.resources = {
            wood: 0,
            stone: 0,
            iron: 0
        };
    }
    function getMaxZIndex() {
        var maxZ = Math.max.apply(null, $.map($("div[class^='ui-dialog']"), function(e, n) {
            if ($(e).css('position') == 'absolute') {
                return parseInt($(e).css('z-index'), 10) || 1000;
            }
        }));
        return (maxZ !== -Infinity) ? maxZ + 1 : 1000;
    }
    function getBrowser() {
        var ua = navigator.userAgent,
            tem,
            M = ua.match(/(opera|maxthon|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
        if (/trident/i.test(M[1])) {
            tem = /\brv[ :]+(\d+)/g.exec(ua) || [];
            M[1] = 'IE';
            M[2] = tem[1] || '';
        }
        if (M[1] === 'Chrome') {
            tem = ua.match(/\bOPR\/(\d+)/);
            if (tem !== null) {
                M[1] = 'Opera';
                M[2] = tem[1];
            }
        }
        M = M[2] ? [M[1], M[2]] : [navigator.appName, navigator.appVersion, '-?'];
        if ((tem = ua.match(/version\/(\d+)/i)) !== null) M.splice(1, 1, tem[1]);

        return M.join(' ');
    }
    function errorHandling(e, fn) {
        if (PID === 1538932 || PID === 100144) {
            HumanMessage.error("Gatinho(" + version + ")-ERROR: " + e.message);
            console.log("Gatinho | Error-Stack | " + [fn] + " | ", e.stack);
        } else {
            if (!DATA.error[version]) {
                DATA.error[version] = {};
            }
        }
    }
    function createWindowType(name, title, width, height, minimizable, position) {
        $('<style id="joe_window">' +
            '.joe_title_img { height:18px; float:left; margin-right:3px; } ' +
            '.joe_title { margin:1px 6px 13px 23px; color:rgb(255,255,122); } ' +
            '</style>').appendTo('head');
        function WndHandler(wndhandle) {
            this.wnd = wndhandle;
        }
        Function.prototype.inherits.call(WndHandler, WndHandlerDefault);
        WndHandler.prototype.getDefaultWindowOptions = function() {
            return {
                position: position,
                width: width,
                height: height,
                minimizable: minimizable,
                title: "" + title + ""
            };
        };
        GPWindowMgr.addWndType(name, "75623", WndHandler, 1);
    }
    ///////////////////////////////////
   //       * Notification *        //
  ///////////////////////////////////
    var Notification = {
        init: function() {
            NotificationType.GATINHO = "felix";
            createWindowType("JOE_Notification", getText("settings", "Update"), 820, 550, true, ["center", "center", 100, 100]);
            $('<style id="joe_notification" type="text/css">' +
                '.ui-dialog.ui-corner-all.ui-widget.ui-widget-content.ui-front.ui-draggable.ui-resizable.js-window-main-container{ position: absolute; height: auto; width: 810px; top: 158.5px; left: 866.5px; z-index: 1005;} ' +
                '#notification_area .felix .icon { background: url(https://i.imgur.com/f8WfWVa.gif) 3px 1px no-repeat !important; transform: scale(0.80);} ' +
                '#notification_area .felix { cursor:pointer; } ' +
                '#NotifText {overflow-y: auto !important; max-height: 460px; border: 2px solid rgb(158, 133, 78); } ' +
                '#NotifText img { max-width:780; text-align: center; margin:5px; } ' +
                '#NotifText .green { color: green; } ' +
                '</style>').appendTo('head');
            var notif = DATA.notification;
            if (notif <= 20) {
                Notification.create(20, 'New messages');
                var NotifText = '<div id="NotifText">' +
                    '<div style="overflow-x: hidden; padding-left: 5px; position: relative;"></div>' +
                    '<p><span style="font-size:21px;">&nbsp;➫ New Blog Gatinho</span><br/>' +
                    '&nbsp;- To start this year 2021 Gatinho created his blog Gatinho, at the moment the description of the modules<br/>' +
                    '&nbsp; is available with some explanations and the history of Gatinho ➫ (<a href="https://mycitygre.000webhostapp.com/Dio-Tools/index.html" target="_blank">Blog Gatinho</a>)<br/>' +
                    '&nbsp;- The older versions were obsolete until 28/07/2021.<br/>' +
                    '<p><span style="font-size:12px;">&nbsp;➫ New toutes les version Dio Tools son disponible ici➫ (<a href="https://mycitygre.000webhostapp.com/Dio-Tools/index.html" target="_blank">Blog Gatinho</a>)</span><br/>' +
                    '<a href="https://mycitygre.000webhostapp.com/Dio-Tools/index.html" target="_blank"><img src="https://mycitygre.000webhostapp.com/Dio-Tools/images/DioToolsGreen.png" height="auto" width="30%"  title="les version" alt="toutes les version"></a><br/>' +
                    '<a href="https://mycitygre.000webhostapp.com/Dio-Tools/index.html" target="_blank"><img src="https://wiki.pt.grepolis.com/images/a/a3/Battleships_logo.png" height="auto" width="30%"  title="les version" alt="toutes les version"></a><br/>' +
                    '<a href="https://mycitygre.000webhostapp.com/Dio-Tools/index.html" target="_blank"><img src="https://mycitygre.000webhostapp.com/Dio-Tools/Dio_tools/wp-content/themes/grepolisqt/img/logo.png" width="50px" title="les version" alt="toutes les version"></a><br/>' +
                    '<div class="green">' + getText("options", "Mess")[0] + '</div><div style="float:left;">' + getText("options", "Mess")[1] + '</div>' +
                    '<img class="" src="https://mycitygre.000webhostapp.com/Notification.png" />' +
                    '<img class="" src="" />' +
                    '<div style="overflow-x: hidden; padding-left: 5px; position: relative;"></div>' +
                    '</div>' +
                    '<div style="bottom: 1px;position: absolute; font-weight: bold;">' +
                    '<span class="" style="font-weight:bold; float:left; margin-left:20px;">' + getText("settings", "cat_forum") + ': ' +
                    '<a id="link_contact" href=' + getText("link", "forum") + ' target="_blank">Gatinho</a></span>' +
                    '<a id="link_forum" href=' + getText("link", "contact") + ' target="_blank" style="font-weight:bold; float:left; margin-left:20px;">' +
                    '<img src="https://gppt.innogamescdn.com/images/game/overviews/culture_25x25.png" alt="" style="margin: -4px 5px -7px 5px;" /><span>' + getText("settings", "forum") + '</span></a>' +
                    '<a id="link_forum" href=' + getText("link", "Update") + ' target="_blank" style="font-weight:bold; float:left; margin-left:20px;">' +
                    '<img src="https://gppt.innogamescdn.com/images/game/overviews/culture_25x25.png" alt="" style="margin: -4px 5px -7px 5px;" /><span>' + getText("settings", "Update") + '</span></a>' +
                    '</div>';
                $('.felix .icon').click(function() {
                    var BBwnd = GPWindowMgr.Create(GPWindowMgr.TYPE_JOE_Notification) || GPWindowMgr.getOpenFirst(GPWindowMgr.TYPE_JOE_Notification).close();
                    BBwnd.setContent(NotifText);
                    $(this).parent().find(".close").click();
                });
                saveValue('notif', '20');
            }
        },
        create: function(nid, feature) {
            var Notification = new NotificationHandler();
            Notification.notify($('#notification_area>.notification').length + 1, uw.NotificationType.GATINHO,
                "<span style='color:rgb(8, 207, 0)'><b><u>" + getText("settings", "Feature") + " 07/05/2021 !</u></b></span>" + feature + "<span class='small notification_date'>Gatinho: v" + version + "</span>");
        }
    };
    ///////////////////////////////////
   //      * Mousewheel Zoom *      //
  ///////////////////////////////////
    var MouseWheelZoom = {
        activate: function() {
            $('#main_area, #joe_political_map, .viewport, .sjs-city-overview-viewport').bind('mousewheel', function(e) {
                e.stopPropagation();
                var current = $('.bull_eye_buttons .checked').get(0).getAttribute("name"),
                    delta = 0,
                    scroll, sub_scroll = 6;
                switch (current) {
                    case 'political_map':
                        scroll = 4;
                        break;
                    case 'strategic_map':
                        scroll = 3;
                        break;
                    case 'island_view':
                        scroll = 2;
                        break;
                    case 'city_overview':
                        scroll = 1;
                        break;
                }
                delta = -e.originalEvent.detail || e.originalEvent.wheelDelta;
                if (scroll !== 4) {
                    if (delta < 0) {
                        scroll += 1;
                    } else {
                        scroll -= 1;
                    }
                } else {
                    sub_scroll = $('.zoom_select').get(0).selectedIndex;
                    if (delta < 0) {
                        sub_scroll -= 1;
                    } else {
                        sub_scroll += 1;
                    }
                    if (sub_scroll === -1) {
                        sub_scroll = 0;
                    }
                    if (sub_scroll === 7) {
                        scroll = 3;
                    }
                }
                switch (scroll) {
                    case 4:
                        if (!$('.bull_eye_buttons .btn_political_map').hasClass("checked")) {
                            $('.bull_eye_buttons .btn_political_map').click();
                        }
                        $('.zoom_select').get(0)[sub_scroll].selected = true;
                        PoliticalMap.zoomToCenter();
                        break;
                    case 3:
                        $('.bull_eye_buttons .strategic_map').click();
                        $('#popup_div').css('display', 'none');
                        break;
                    case 2:
                        $('.bull_eye_buttons .island_view').click();
                        TownPopup.remove();
                        break;
                    case 1:
                        $('.bull_eye_buttons .city_overview').click();
                        break;
                }
                return false;
            });
        },
        deactivate: function() {
            $('#main_area, .ui_city_overview').unbind('mousewheel');
        }
    };
    ///////////////////////////////////
   //         * Statistics *        //
  ///////////////////////////////////
    var Statistics = {
        activate: function() {
            Statistics.addButton();
            $('<style id="joe_statistic">' +
                'path { stroke: steelblue; stroke-width: 1; fill: none; } ' +
                '.axis { shape-rendering: crispEdges; } ' +
                '.x.axis line { stroke: lightgrey; } ' +
                '.x.axis .minor { stroke-opacity: .5; } ' +
                '.x.axis path { display: none; } ' +
                '.y.axis line, .y.axis path { fill: none; stroke: #000; } ' +
                '</style>').appendTo('head');
            Statistics.ClickCounter.activate();
            createWindowType("JOE_STATISTICS", "Statistics", 300, 250, true, ["center", "center", 100, 100]);
        },
        deactivate: function() {
            $('#joe_statistic_button').remove();
            $('#joe_statistic').remove();
            Statistics.ClickCounter.deactivate();
        },
        addButton: function() {
            $('<div id="joe_statistic_button" class="circle_button"><div class="ico_statistics js-caption"></div></div>').appendTo(".gods_area");
            $('<style id="joe_statistic_style">' +
                '#joe_statistic_button { top:56px; left:-4px; z-index:10; position:absolute; } ' +

                '#joe_statistic_button .ico_statistics { margin:7px 0px 0px 8px; width:17px; height:17px; background:url(https://i.imgur.com/wsmJMqz.png) no-repeat 0px 0px; background-size:100%; } ' +

                '#joe_statistic_button .ico_statistics.checked { margin-top:8px; } ' +
                '</style>').appendTo('head');
            $('#joe_statistic_button').tooltip(getText("labels", "uni")); // TODO
            $('#joe_statistic_button').on('mousedown', function() {
                $('#joe_statistic_button, .ico_statistics').addClass("checked");
            }).on('mouseup', function() {
                $('#joe_statistic_button, .ico_statistics').removeClass("checked");
            });
            $('#joe_statistic_button').click(function() {
                if (!Layout.wnd.getOpenFirst(GPWindowMgr.TYPE_JOE_STATISTICS)) {
                    Statistics.openWindow();
                    $('#joe_statistic_button, .ico_statistics').addClass("checked");
                } else {
                    Statistics.closeWindow();
                    $('#joe_statistic_button, .ico_statistics').removeClass("checked");
                }
            });
        },
        openWindow: function() {
            var content =
                '<div id="joe_mouseclicks" style="margin-bottom:5px; font-style:italic;">' +
                '<span style="text-decoration:underline;">Insgesamt:</span> <span></span>' +
                '<span style="float:right;"></span><span style="text-decoration:underline;float:right;">Heute:</span> ' +
                '</div><canvas id="joe_graph" width="290" height="150" style="margin-top:15px;"></canvas>';
            Layout.wnd.Create(GPWindowMgr.TYPE_JOE_STATISTICS).setContent(content);
            Statistics.ClickCounter.onOpenWindow();
            var graph, xPadding = 35,
                yPadding = 25;
            var data = {
                values: [{
                    X: "Jan",
                    Y: 0
                }]
            };
            for (var o in DATA.clickCount) {
                data.values.push({
                    X: "opp",
                    Y: DATA.clickCount[o]
                });
            }

            function getMaxY() {
                var max = 0;
                for (var i = 0; i < data.values.length; i++) {
                    if (data.values[i].Y > max) {
                        max = data.values[i].Y;
                    }
                }
                max += 10 - max % 10;
                return max + 10;
            }

            function getXPixel(val) {
                return ((graph.width() - xPadding) / data.values.length) * val + (xPadding + 10);
            }

            function getYPixel(val) {
                return graph.height() - (((graph.height() - yPadding) / getMaxY()) * val) - yPadding;
            }
            graph = $('#joe_graph');
            var c = graph[0].getContext('2d');
            c.lineWidth = 2;
            c.strokeStyle = '#333';
            c.font = 'italic 8pt sans-serif';
            c.textAlign = "center";
            c.beginPath();
            c.moveTo(xPadding, 0);
            c.lineTo(xPadding, graph.height() - yPadding);
            c.lineTo(graph.width(), graph.height() - yPadding);
            c.stroke();
            for (var x = 0; x < data.values.length; x++) {
                c.fillText(data.values[x].X, getXPixel(x), graph.height() - yPadding + 20);
            }
            c.textAlign = "right";
            c.textBaseline = "middle";
            var maxY = getMaxY(),
                maxYscala = Math.ceil(maxY / 1000) * 1000;
            for (var y = 0; y < maxY; y += maxYscala / 10) {
                c.fillText(y, xPadding - 10, getYPixel(y));
            }
            c.strokeStyle = 'rgb(0,150,0)';
            c.beginPath();
            c.moveTo(getXPixel(0), getYPixel(data.values[0].Y));
            for (var i = 1; i < data.values.length; i++) {
                c.lineTo(getXPixel(i), getYPixel(data.values[i].Y));
            }
            c.stroke();
            c.fillStyle = '#333';
            for (var p = 0; p < data.values.length; p++) {
                c.beginPath();
                c.arc(getXPixel(p), getYPixel(data.values[p].Y), 2, 0, Math.PI * 2, true);
                c.fill();
            }
        },
        closeWindow: function() {
            Layout.wnd.getOpenFirst(GPWindowMgr.TYPE_JOE_STATISTICS).close();
        },
        ClickCounter: {
            today: "00000000",
            activate: function() {
                Statistics.ClickCounter.updateDate();
                $(document).on("mousedown", function() {
                    DATA.clickCount[Statistics.ClickCounter.today]++;
                });
                window.onbeforeunload = function() {
                    Statistics.ClickCounter.save();
                };
                setTimeout(function() {
                    Statistics.ClickCounter.updateDate();
                }, 0);
            },
            deactivate: function() {
                $(document).off("mousedown");
            },
            save: function() {
                saveValue(WID + "_click_count", JSON.stringify(DATA.clickCount));
            },
            updateDate: function() {
                var today = new Date((window.Timestamp.server() + 7200) * 1000);
                Statistics.ClickCounter.today = today.getUTCFullYear() + ((today.getUTCMonth() + 1) < 10 ? "0" : "") + (today.getUTCMonth() + 1) + (today.getUTCDate() < 10 ? "0" : "") + today.getUTCDate();
                DATA.clickCount[Statistics.ClickCounter.today] = DATA.clickCount[Statistics.ClickCounter.today] || 0;
            },
            onOpenWindow: function() {
                $('#joe_mouseclicks span:eq(2)').get(0).innerHTML = DATA.clickCount[Statistics.ClickCounter.today];
                $(document).off("mousedown");
                $(document).on("mousedown", function() {
                    if ($('#joe_mouseclicks').get(0)) {
                        $('#joe_mouseclicks span:eq(2)').get(0).innerHTML = ++DATA.clickCount[Statistics.ClickCounter.today];
                    } else {
                        DATA.clickCount[Statistics.ClickCounter.today]++;
                        $(document).off("mousedown");
                        $(document).on("mousedown", function() {
                            DATA.clickCount[Statistics.ClickCounter.today]++;
                        });
                    }
                });
            }
        },
        LuckCounter: {
            luckArray: {},
            count: function() {
                if ($('.fight_bonus.luck').get(0)) {
                    var report_id = $('#report_report_header .game_arrow_delete').attr("onclick").split(",")[1].split(")")[0].trim(),
                        luck = parseInt($('.fight_bonus.luck').get(0).innerHTML.split(":")[1].split("%")[0].trim(), 10);
                    Statistics.LuckCounter.luckArray[report_id] = luck;
                }
            },
            calcAverage: function() {
                var sum = 0,
                    count = 0;
                for (var report_id in Statistics.LuckCounter.luckArray) {
                    if (Statistics.LuckCounter.luckArray.hasOwnProperty(report_id)) {
                        sum += parseInt(Statistics.LuckCounter.luckArray[report_id], 10);
                        count++;
                    }
                }
                return (parseFloat(sum) / parseFloat(count));
            }
        }
    };
    ///////////////////////////////////
   //        * Body Handler *       //
  ///////////////////////////////////
    function updatehides() {
        if (DATA.options.Hid) {
            setTimeout(function() {
                hidesIndexIron.add();
            }, 200);
        };
    };
    function updateIcon() {
        setTimeout(function() {
            var townType = (manuTownTypes[uw.Game.townId] || ((autoTownTypes[uw.Game.townId] || "no")));
            $('#town_icon .icon_big').removeClass().addClass('icon_big townicon_' + townType + " auto");
            $('#town_icon .icon_big').css({
                backgroundPosition: TownIcons.types[townType] * -25 + 'px 0px'
            });
        }, 200);
    };
    $(".btn_next_town").click(function() {
        updateIcon();
        updatehides();
    });
    $(".btn_prev_town").click(function() {
        updateIcon();
        updatehides();
    });
    $("#select_town").click(updateIcon);

    function imageSelectionProtection() {
        $('<style id="joe_image_selection" type="text/css"> img { -moz-user-select: -moz-none; -khtml-user-select: none; -webkit-user-select: none;} </style>').appendTo('head');
    }
    var worldWonderIcon = {
        colossus_of_rhodes: "url(https://gpall.innogamescdn.com/images/game/map/wonder_colossus_of_rhodes.png) 38px -1px;",
        great_pyramid_of_giza: "url(https://gpall.innogamescdn.com/images/game/map/wonder_great_pyramid_of_giza.png) 34px -6px;",
        hanging_gardens_of_babylon: "url(https://gpall.innogamescdn.com/images/game/map/wonder_hanging_gardens_of_babylon.png) 34px -5px;",
        lighthouse_of_alexandria: "url(https://gpall.innogamescdn.com/images/game/map/wonder_lighthouse_of_alexandria.png) 37px -1px;",
        mausoleum_of_halicarnassus: "url(https://gpall.innogamescdn.com/images/game/map/wonder_mausoleum_of_halicarnassus.png) 37px -4px;",
        statue_of_zeus_at_olympia: "url(https://gpall.innogamescdn.com/images/game/map/wonder_statue_of_zeus_at_olympia.png) 36px -3px;",
        temple_of_artemis_at_ephesus: "url(https://gpall.innogamescdn.com/images/game/map/wonder_temple_of_artemis_at_ephesus.png) 34px -5px;"
    };
    var WorldWonderIcons = {
        activate: function() {
            try {
                if (!$('#joe_wondericons').get(0)) {
                    var color = "orange";
                    var style_str = "<style id='joe_wondericons' type='text/css'>";
                    for (var ww_type in wonder.map) {
                        if (wonder.map.hasOwnProperty(ww_type)) {
                            for (var ww in wonder.map[ww_type]) {
                                if (wonder.map[ww_type].hasOwnProperty(ww)) {

                                    style_str += "#mini_i" + ww + ":before {" +
                                        "content: '';" +
                                        "background:" + color + " " + worldWonderIcon[ww_type] +
                                        "background-size: auto 97%;" +
                                        "padding: 8px 16px;" +
                                        "top: 50px;" +
                                        "position: relative;" +
                                        "border-radius: 40px;" +
                                        "z-index: 200;" +
                                        "cursor: pointer;" +
                                        "box-shadow: 1px 1px 0px rgba(0, 0, 0, 0.5);" +
                                        "border: 2px solid green; } " +
                                        "#mini_i" + ww + ":hover:before { z-index: 201; " +
                                        "filter: url(#Brightness12);" +
                                        "box-shadow: 2px 0px 10px #08ff00;" +
                                        "border-radius: 50%;" +
                                        "-webkit-filter: brightness(1.2); } ";
                                }
                            }
                        }
                    }
                    $(style_str + "</style>").appendTo('head');
                    $('#minimap_islands_layer').on('click', '.m_island', function(e) {
                        var ww_coords = this.id.split("i")[3].split("_");
                        uw.Layout.contextMenu(e, 'wonder', {
                            ix: ww_coords[0],
                            iy: ww_coords[1]
                        });
                    });
                }
            } catch (error) {
                errorHandling(error, "setWonderIconsOnMap");
            }
        },
        deactivate: function() {
            $('#joe_wondericons').remove();
        }
    };
    var TownIcons = {
        types: {
            lo: 0,
            ld: 3,
            so: 6,
            sd: 7,
            fo: 10,
            fd: 9,
            bu: 14,
            po: 22,
            no: 12,
            fa: 20,
            re: 15,
            di: 2,
            sh: 1,
            lu: 13,
            dp: 11,
            ha: 15,
            si: 18,
            ra: 17,
            ch: 19,
            ti: 23,
            un: 5,
            wd: 16,
            wo: 24,
            bo: 13,
            gr: 21,
            st: 17,
            is: 26,
            he: 4,
            ko: 8
        },
        deactivate: function() {
            $('#town_icon').remove();
            $('#joe_townicons_field').remove();
            TownPopup.deactivate();
        },
        activate: function() {
            try {
                $('<div id="town_icon"><div class="town_icon_bg"><div class="icon_big townicon_' +
                    (manuTownTypes[uw.Game.townId] || ((autoTownTypes[uw.Game.townId] || "no") + " auto")) + '"></div></div></div>').appendTo('.town_name_area');
                $('#town_icon .icon_big').css({
                    backgroundPosition: TownIcons.types[(manuTownTypes[uw.Game.townId] || ((autoTownTypes[uw.Game.townId] || "no")))] * -25 + 'px 0px'
                });
                $('<style id="joe_townicons_field" type="text/css">' +
                    '#town_icon { background:url(' + joe_sprite + ') 0 -125px no-repeat; position:absolute; width:69px; height:61px; left:-47px; top:0px; z-index: 10; } ' +
                    '#town_icon .town_icon_bg { background:url(' + joe_sprite + ') -76px -129px no-repeat; width:43px; height:43px; left:25px; top:4px; cursor:pointer; position: relative; } ' +
                    '#town_icon .town_icon_bg:hover { filter:url(#Brightness11); -webkit-filter:brightness(1.1); box-shadow: 0px 0px 15px rgb(1, 197, 33); } ' +
                    '#town_icon .icon_big	{ position:absolute; left:9px; top:9px; height:25px; width:25px; } ' +
                    '#town_icon .select_town_icon {position: absolute; top:47px; left:23px; width:145px; display:none; padding:2px; border:3px inset rgb(7, 99, 12); box-shadow:rgba(0, 0, 0, 0.5) 4px 4px 6px; border-radius:0px 10px 10px 10px;' +
                    'background:url(https://gpall.innogamescdn.com/images/game/popup/middle_middle.png); } ' +
                    '#town_icon .item-list { max-height:400px; max-width:200px; align:right; overflow-x:hidden; } ' +
                    '#town_icon .option_s { cursor:pointer; width:20px; height:20px; margin:0px; padding:2px 2px 3px 3px; border:2px solid rgba(0,0,0,0); border-radius:5px; background-origin:content-box; background-clip:content-box;} ' +
                    '#town_icon .option_s:hover { border: 2px solid rgb(59, 121, 81) !important;-webkit-filter: brightness(1.3); } ' +
                    '#town_icon .sel { border: 2px solid rgb(202, 176, 109); } ' +
                    '#town_icon hr { width:145px; margin:0px 0px 7px 0px; position:relative; top:3px; border:0px; border-top:2px dotted #000; float:left} ' +
                    '#town_icon .auto_s { width:136px; height:16px; float:left} ' +
                    '.ui_quickbar .left, .ui_quickbar .right { width:46%; } ' +
                    '.town_name_area { z-index:11; left:52%; } ' +
                    '.town_name_area .left { z-index:20; left:-39px; } ' +
                    '</style>').appendTo('head');
                var icoArray = ['ld', 'lo', 'sh', 'di', 'un',
                    'sd', 'so', 'ko', 'ti', 'gr',
                    'fd', 'fo', 'dp', 'no', 'po',
                    're', 'wd', 'st', 'si', 'bu',
                    'he', 'ch', 'bo', 'fa', 'wo'
                ];
                $('<div class="select_town_icon dropdown-list default active"><div class="item-list"></div></div>').appendTo("#town_icon");
                for (var i in icoArray) {
                    if (icoArray.hasOwnProperty(i)) {
                        $('.select_town_icon .item-list').append('<div class="option_s icon_small townicon_' + icoArray[i] + '" name="' + icoArray[i] + '"></div>');
                    }
                }
                $('<hr><div class="option_s auto_s" name="auto"><b>Auto</b></div>').appendTo('.select_town_icon .item-list');

                $('#town_icon .option_s').click(function() {
                    $("#town_icon .sel").removeClass("sel");
                    $(this).addClass("sel");

                    if ($(this).attr("name") === "auto") {
                        delete manuTownTypes[uw.Game.townId];
                    } else {
                        manuTownTypes[uw.Game.townId] = $(this).attr("name");
                    }
                    TownIcons.changeTownIcon();
                    TownIcons.Map.activate();
                    saveValue(WID + "_townTypes", JSON.stringify(manuTownTypes));
                });
                $('#town_icon .town_icon_bg').click(function() {
                    var el = $('#town_icon .select_town_icon').get(0);
                    if (el.style.display === "none") {
                        el.style.display = "block";
                    } else {
                        el.style.display = "none";
                    }
                });
                $('#town_icon .select_town_icon [name="' + (manuTownTypes[uw.Game.townId] || (autoTownTypes[uw.Game.townId] ? "auto" : "")) + '"]').addClass("sel");
            } catch (error) {
                errorHandling(error, "addTownIcon");
            }
        },
        changeTownIcon: function() {
            var townType = (manuTownTypes[uw.Game.townId] || ((autoTownTypes[uw.Game.townId] || "no")));
            $('#town_icon .icon_big').removeClass().addClass('icon_big townicon_' + townType + " auto");
            $('#town_icon .sel').removeClass("sel");
            $('#town_icon .select_town_icon [name="' + (manuTownTypes[uw.Game.townId] || (autoTownTypes[uw.Game.townId] ? "auto" : "")) + '"]').addClass("sel");
            $('#town_icon .icon_big').css({
                backgroundPosition: TownIcons.types[townType] * -25 + 'px 0px'
            });
            $('#town_icon .select_town_icon').get(0).style.display = "none";
        },
        Map: {
            activate: function() {
                try {
                    if ($('#joe_townicons_map').get(0)) {
                        $('#joe_townicons_map').remove();
                    }
                    var start = (new Date()).getTime(),
                        end, style_str = "<style id='joe_townicons_map' type='text/css'>";
                    for (var e in autoTownTypes) {
                        if (autoTownTypes.hasOwnProperty(e)) {
                            style_str += "#mini_t" + e + ", #town_flag_" + e + " .flagpole {" +
                                "background: rgb(256, 256, 0) url(" + joe_sprite + ") " + (TownIcons.types[(manuTownTypes[e] || autoTownTypes[e])] * -25) + "px -27px repeat !important; } ";
                        }
                    }
                    style_str += ".own_town .flagpole, #main_area .m_town.player_" + PID + " { z-index: 100 !important; cursor: pointer; width:19px !important; height:19px !important; border-radius: 11px; border: 2px solid rgb(16, 133, 0); margin: -4px !important; font-size: 0em !important; box-shadow: 1px 1px 0px rgba(0, 0, 0, 0.5); } ";
                    style_str += ".own_town .flagpole:hover, .m_town:hover { z-index: 101 !important; filter: brightness(1.2); -webkit-filter: brightness(1.2); font-size: 2em; margin-top: -1px; } ";
                    style_str += "#minimap_islands_layer .m_town { z-index: 99; cursor: pointer; } ";
                    $('#minimap_islands_layer').off('click', '.m_town');
                    $('#minimap_islands_layer').on('click', '.m_town', function(z) {
                        var id = parseInt(this.id.substring(6), 10);
                        if (typeof(uw.ITowns.getTown(id)) !== "undefined") {
                            Layout.contextMenu(z, 'determine', {
                                "id": id,
                                "name": uw.ITowns.getTown(id).name
                            });
                        } else {
                            Layout.contextMenu(z, 'determine', {
                                "id": id
                            });
                        }
                        z.stopPropagation();
                    });
                    style_str += "#joe_town_popup .count { position: absolute; bottom: 1px; right: 1px; font-size: 10px; } ";
                    $('#minimap_islands_layer').off('mouseout', '.m_town');
                    $('#minimap_islands_layer').on('mouseout', '.m_town', function() {
                        TownPopup.remove();
                    });
                    $('#minimap_islands_layer').off('mouseover', '.m_town');
                    $('#minimap_islands_layer').on('mouseover', '.m_town', function() {
                        TownPopup.add(this);
                    });
                    $('#map_towns').off('mouseout', '.own_town .flagpole');
                    $('#map_towns').on('mouseout', '.own_town .flagpole', function() {
                        TownPopup.remove();
                    });
                    $('#map_towns').off('mouseover', '.own_town .flagpole');
                    $('#map_towns').on('mouseover', '.own_town .flagpole', function() {
                        TownPopup.add(this);
                    });
                    style_str += "#minimap_islands_layer .m_town { text-shadow: 1px 1px 0px rgba(0, 0, 0, 0.7); } ";
                    style_str += "#minimap_canvas.expanded.night, #map.night .flagpole { filter: brightness(0.7); -webkit-filter: brightness(0.7); } ";
                    style_str += "#minimap_click_layer { display:none; }";
                    style_str += "</style>";
                    $(style_str).appendTo('head');
                } catch (error) {
                    errorHandling(error, "TownIcons.Map.activate");
                }
            },
            deactivate: function() {
                $('#joe_townicons_map').remove();
                $("#joe_town_popup_style").remove();

                // Events entfernen
                $('#minimap_islands_layer').off('click', '.m_town');

                $('#minimap_islands_layer').off('mouseout', '.m_town');
                $('#minimap_islands_layer').off('mouseover', '.m_town');
            }
        }
    };
    var TownPopup = {
        activate: function() {
            $('<style id="joe_town_popup_style" type="text/css">' +
                '#joe_town_popup { position:absolute; z-index:6002;max-width: 173px;} ' +
                '#joe_town_popup .title { margin:5px;font-weight: bold; } ' +
                '#joe_town_popup .joe_branding { position:absolute; right:12px; top:8px; height: 20px; filter:sepia(1); -webkit-filter:sepia(1); opacity:0.5; } ' +
                '#joe_town_popup .unit_content, ' +
                '#joe_town_popup .spy_content, ' +
                '#joe_town_popup .god_content, ' +
                '#joe_town_popup .hero_content, ' +
                '#joe_town_popup .resources_content { background-color: #ffe2a1; border: 1px solid #e1af55; margin-top:2px; padding: 4px; font-family: Arial;font-weight: 700;font-size: 0.8em; } ' +
                '#joe_town_popup .resources_content { text-align: right; margin-top:3px; } ' +
                '#joe_town_popup .resources_content table { min-width:95% } ' +
                '#joe_town_popup .footer_content { margin-top:3px;  } ' +
                '#joe_town_popup .footer_content table { width:100%; } ' +
                '#joe_town_popup .spy_content { height:25px; margin-right:3px; } ' +
                '#joe_town_popup .god_content { width:25px; } ' +
                '#joe_town_popup .hero_content { width:25px; } ' +
                '#joe_town_popup .god_mini { transform:scale(0.4); margin: -19px; } ' +
                '#joe_town_popup .god_mini.null { background: url(https://gppt.innogamescdn.com/images/game/autogenerated/layout/layout_596941d.png) no-repeat -488px -212px; width: 80px; height: 88px; z-index: 8; position: absolute; top: 136px; right: 7px; cursor: pointer; transform: scale(0.35);} ' +
                '#joe_town_popup .count { position: absolute; bottom: -2px; right: 2px; font-size: 10px; font-family: Verdana,Arial,Helvetica,sans-serif; } ' +
                '#joe_town_popup .four_digit_number .count { font-size:8px !important; } ' +
                '#joe_town_popup .unit_icon25x25 { border: 1px solid #6e4b0b; margin: 1px; } ' +
                '#joe_town_popup .wall { width:25px; height:25px; background-image:url(https://gpde.innogamescdn.com/images/game/main/wall.png); border: 1px solid #6e4b0b; margin: 1px; display: inline-block; vertical-align: middle; background-size: 100%; } ' +
                '#joe_town_popup .support_filter { margin: 0px 4px 0px 0px; float:left; } ' +
                '#joe_town_popup .spy_text { line-height: 2.3em; float:left; } ' +
                '#joe_town_popup .fury_icon { width:22px; height:15px; background: url(https://wiki.en.grepolis.com/images/thumb/a/ab/Fury_icon.png/30px-Fury_icon.png) no-repeat; margin-left:2px; display: inline-block; vertical-align: middle; background-size: 95%;} ' +
                '#joe_town_popup .popup_middle_right { min-width: 11px; } ' +
                '</style>').appendTo('head');
        },
        deactivate: function() {
            $("#joe_town_popup_style").remove();
        },
        add: function(that) {
            var townID = 0;
            if (that.id === "") {
                townID = parseInt($(that).parent()[0].id.substring(10), 10);
            } else {
                townID = parseInt(that.id.substring(6), 10);
            }
            if (typeof(uw.ITowns.getTown(townID)) !== "undefined") {
                var units = ITowns.getTowns()[townID].units();
                TownPopup.remove();
                var popup = "<table class='popup' id='joe_town_popup' style='left:" + ($(that).offset().left + 20) + "px; top:" + ($(that).offset().top + 20) + "px; ' cellspacing='0px' cellpadding='0px'>";
                popup += "<tr class='popup_top'><td class='popup_top_left'></td><td class='popup_top_middle'></td><td class='popup_top_right'></td></tr>";
                popup += "<tr><td class='popup_middle_left'>&nbsp;</td><td style='width: auto;' class='popup_middle_middle'>";
                popup += "<h4><span style='white-space: nowrap;margin-right:35px;'>" + uw.ITowns.getTown(townID).name + "</span><img class='joe_branding' src='https://i.imgur.com/f8WfWVa.gif'></h4>";
                popup += "<div class='unit_content'>";
                if (!$.isEmptyObject(units)) {
                    for (var unit_id in units) {
                        if (units.hasOwnProperty(unit_id)) {
                            var classSize = "";
                            if (units[unit_id] > 1000) {
                                classSize = "four_digit_number";
                            }
                            popup += '<div class="unit_icon25x25 ' + unit_id + ' ' + classSize + '"><span class="count text_shadow">' + units[unit_id] + '</span></div>';
                        }
                    }
                }
                var wallLevel = ITowns.getTowns()[townID].getBuildings().attributes.wall;
                popup += '<div class="wall image bold"><span class="count text_shadow">' + wallLevel + '</span></div>';
                popup += "</div>";
                popup += "<div class='resources_content'><table cellspacing='2px' cellpadding='0px'><tr>";
                var resources = ITowns.getTowns()[townID].resources();
                var storage = ITowns.getTowns()[townID].getStorage();
                var maxFavor = ITowns.getTowns()[townID].getMaxFavor();
                var Fury = uw.ITowns.player_gods.attributes.fury;
                var fury_max = uw.ITowns.player_gods.attributes.max_fury;
                var textColor = (resources.wood === storage) ? textColor = "color:red;" : textColor = "";
                popup += '<td class="resources_small wood"></td><td style="' + textColor + '; width:1%;">' + resources.wood + '</td>';
                popup += '<td style="min-width:15px;"></td>';
                popup += '<td class="resources_small population"></td><td style="width:1%">' + resources.population + '</td>';
                popup += '</tr><tr>';
                textColor = (resources.stone === storage) ? textColor = "color:red;" : textColor = "";
                popup += '<td class="resources_small stone"></td><td style="' + textColor + '">' + resources.stone + '</td>';
                popup += '<td style="min-width:15px;"></td>';
                var textColor = (resources.favor === maxFavor) ? textColor = "color:red;" : textColor = "";
                popup += '<td class="resources_small favor"></td><td style="' + textColor + '; width:1%">' + resources.favor + '</td>';
                popup += '</tr><tr>';
                textColor = (resources.iron === storage) ? textColor = "color:red;" : textColor = "";
                popup += '<td class="resources_small iron"></td><td style="' + textColor + '">' + resources.iron + '</td>';
                if (uw.ITowns.getTowns()[townID].god() == "ares") {
                    popup += '<td style="min-width:15px;"></td>';
                    textColor = (Fury === fury_max) ? textColor = "color:red;" : textColor = "";
                    popup += '<td class="fury_icon"></td><td style="' + textColor + '; width:1%">' + Fury + '</td>';
                }
                popup += "</tr></table></div>";
                popup += "<div class='footer_content'><table cellspacing='0px'><tr>";
                var spy_storage = ITowns.getTowns()[townID].getEspionageStorage();
                popup += "<td class='spy_content'>";
                popup += '<div class="support_filter attack_spy"></div><div class="spy_text">' + pointNumber(spy_storage) + '</div>';
                popup += "</td>";
                popup += "<td></td>";
                var HeroArray = ITowns.getHeroJOE()[townID];
                if (HeroArray) {
                    popup += "<td class='hero_content'>";
                    popup += '<div class="hero_icon hero25x25 ' + HeroArray.hero_name + '"><span class="count text_shadow">' + HeroArray.hero_level + '</span></div>';
                    popup += "</td>";
                    popup += "<td></td>";

                };
                var god = ITowns.getTowns()[townID].god();
                popup += "<td class='god_content'>";
                popup += '<div class="god_mini ' + god + '"></div>';
                popup += "</td>";
                popup += "</tr></table></div>";
                popup += "</td><td class='popup_middle_right'>&nbsp;</td></tr>";
                popup += "<tr class='popup_bottom'><td class='popup_bottom_left'></td><td class='popup_bottom_middle'></td><td class='popup_bottom_right'></td></tr>";
                popup += "</table>";
                $(popup).appendTo("#popup_div_curtain");
            }
        },
        remove: function() {
            $('#joe_town_popup').remove();
        }
    };
    var style_str = '<style id="joe_townicons" type="text/css">';
    for (var s in TownIcons.types) {
        if (TownIcons.types.hasOwnProperty(s)) {
            style_str += '.townicon_' + s + ' { background:url(' + joe_sprite + ') ' + (TownIcons.types[s] * -25) + 'px -26px repeat;float:left;} ';
        }
    }
    style_str += '</style>';
    $(style_str).appendTo('head');
    var ContextMenu = {
        activate: function() {
            $.Observer(uw.GameEvents.map.context_menu.click).subscribe('JOE_CONTEXT', function(e, data) {
                if (DATA.options.con && $('#context_menu').children().length == 4) {
                    $('#context_menu div#goToTown').css({
                        left: '0px',
                        top: '0px',
                        WebkitAnimation: 'none',
                        animation: 'none'
                    });
                }
                if (LID === "de" && $('#select_town').get(0)) {
                    $("#select_town .caption").get(0).innerHTML = "Selektieren";
                }
            });
            $('<style id="joe_context_menu" type="text/css">' +
                '#select_town { left: 0px !important; top: 0px !important; z-index: 6; } ' +
                '#context_menu div#goToTown { left: 30px; top: -51px; ' +
                '-webkit-animation: A 0.115s linear; animation: B 0.2s;} ' +
                '@-webkit-keyframes A { from {left: 0px; top: 0px;} to {left: 30px; top: -51px;} }' +
                '@keyframes B { from {left: 0px; top: 0px;} to {left: 30px; top: -51px;} }' +
                '</style>').appendTo('head');
        },
        deactivate: function() {
            $.Observer(uw.GameEvents.map.context_menu.click).unsubscribe('JOE_CONTEXT');
            $('#joe_context_menu').remove();
        }
    };
    var TownList = {
        activate: function() {
            $('<style id="joe_town_list" type="text/css">' +
                '.town_name:hover { filter: url(#Brightness11); -webkit-filter: brightness(1.1); text-shadow: 0.0em 0.0em 0.5em rgb(1 197 33); } ' +
                '.caption.js-viewport:hover { box-shadow: 0px 0px 16px rgb(1 197 33); } ' +
                '.casted_powers_area:hover { box-shadow: 0px 0px 16px rgb(1 197 33); } ' +
                '#input_townbb:hover { box-shadow: 0px 0px 16px rgb(1 197 33); } ' +
                '#town_groups_list .item { text-align: left; padding-left:35px; } ' +
                '#town_groups_list .inner_column { border: 1px solid rgba(100, 100, 0, 0.3);margin: -2px 0px 0px 2px; } ' +
                '#town_groups_list .island_quest_icon { background-size: 90%; position: absolute; right: 37px; top: 4px; } ' +
                '#town_groups_list .island_quest_icon.hidden { display:none; } ' +
                '#town_groups_list .jump_town { right: 37px !important; } ' +
                '#town_groups_list .pop_percent { position: absolute; right: 7px; top:0px; font-size: 0.7em; display:block !important;} ' +
                '#town_groups_list .full { color: green; } ' +
                '#town_groups_list .threequarter { color: darkgoldenrod; } ' +
                '#town_groups_list .half { color: darkred; } ' +
                '#town_groups_list .quarter { color: red; } ' +
                '</style>').appendTo('head');
            var i = 0;
            while (uw.layout_main_controller.sub_controllers[i].name != 'town_name_area') {
                i++;
            }
            uw.layout_main_controller.sub_controllers[i].controller.town_groups_list_view.render_old = uw.layout_main_controller.sub_controllers[i].controller.town_groups_list_view.render;
            uw.layout_main_controller.sub_controllers[i].controller.town_groups_list_view.render = function() {
                uw.layout_main_controller.sub_controllers[i].controller.town_groups_list_view.render_old();
                TownList.change();
            };
            if ($('#town_groups_list').get(0)) {
                TownList.change();
            }
        },
        deactivate: function() {
            var i = 0;
            while (uw.layout_main_controller.sub_controllers[i].name != 'town_name_area') {
                i++;
            }
            layout_main_controller.sub_controllers[i].controller.town_groups_list_view.render = layout_main_controller.sub_controllers[i].controller.town_groups_list_view.render_old;
            $('#joe_town_list').remove();
            $('#town_groups_list .small_icon, #town_groups_list .pop_percent').css({
                display: 'none'
            });
            $("#town_groups_list .town_group_town").unbind('mouseenter mouseleave');
        },
        change: function() {
            if (!$('#town_groups_list .icon_small').get(0) && !$('#town_groups_list .pop_percent').get(0)) {
                $("#town_groups_list .town_group_town").each(function() {
                    try {
                        var town_item = $(this),
                            town_id = town_item.attr('name'),
                            townicon_div, percent_div = "",
                            percent = -1,
                            pop_space = "full";
                        if (population[town_id]) {
                            percent = population[town_id].percent;
                        }
                        if (percent < 75) {
                            pop_space = "threequarter";
                        }
                        if (percent < 50) {
                            pop_space = "half";
                        }
                        if (percent < 25) {
                            pop_space = "quarter";
                        }
                        if (!town_item.find('icon_small').length) {
                            townicon_div = '<div class="icon_small townicon_' + (manuTownTypes[town_id] || autoTownTypes[town_id] || "no") + '"></div>';
                            if (percent != -1) {
                                percent_div = '<div class="pop_percent ' + pop_space + '">' + percent + '%</div>';
                            }
                            town_item.prepend(townicon_div + percent_div);
                        }
                    } catch (error) {
                        errorHandling(error, "TownList.change");
                    }
                });
            }
            $("#town_groups_list .town_group_town").hover(function() {
                $(this).find('.island_quest_icon').addClass("hidden");
            }, function() {
                $(this).find('.island_quest_icon').removeClass("hidden");
            });
        }
    };
    var HiddenHighlightWindow = {
        activate: function() {
            $('<style id="joe_hidden_highlight_window" type="text/css">' +
                '.strategic_map_filter { display:none !important; } ' +
                '</style>').appendTo('head');
        },
        deactivate: function() {
            $('#joe_hidden_highlight_window').remove();
        }
    };
    ///////////////////////////////////
   //      * Available units *      //
  ///////////////////////////////////
    var groupUnitArray = {};

    function getAllUnits() {
        try {
            var townArray = uw.ITowns.getTowns(),
                groupArray = uw.ITowns.townGroups.getGroupsJOE(),
                unitArray = {
                    "sword": 0,
                    "archer": 0,
                    "hoplite": 0,
                    "chariot": 0,
                    "godsent": 0,
                    "rider": 0,
                    "slinger": 0,
                    "catapult": 0,
                    "small_transporter": 0,
                    "big_transporter": 0,
                    "manticore": 0,
                    "harpy": 0,
                    "pegasus": 0,
                    "cerberus": 0,
                    "minotaur": 0,
                    "medusa": 0,
                    "zyklop": 0,
                    "centaur": 0,
                    "fury": 0,
                    "sea_monster": 0
                },
                unitArraySea = {
                    "bireme": 0,
                    "trireme": 0,
                    "attack_ship": 0,
                    "demolition_ship": 0,
                    "colonize_ship": 0
                };
            if (uw.Game.hasArtemis) {
                unitArray = $.extend(unitArray, {
                    "griffin": 0,
                    "calydonian_boar": 0
                });
            }
            if (Game.gods_active.aphrodite) {
                unitArray = $.extend(unitArray, {
                    "siren": 0,
                    "satyr": 0
                });
            }
            if (Game.gods_active.ares) {
                unitArray = $.extend(unitArray, {
                    "spartoi": 0,
                    "ladon": 0
                });
            }
            unitArray = $.extend(unitArray, unitArraySea);
            for (var group in groupArray) {
                if (groupArray.hasOwnProperty(group)) {
                    groupUnitArray[group] = Object.create(unitArray);
                    for (var town in groupArray[group].towns) {
                        if (groupArray[group].towns.hasOwnProperty(town)) {
                            var type = {
                                lo: 0,
                                ld: 0,
                                so: 0,
                                sd: 0,
                                fo: 0,
                                fd: 0
                            }; // Type for TownList
                            for (var unit in unitArray) {
                                if (unitArray.hasOwnProperty(unit)) {
                                    var tmp = parseInt(uw.ITowns.getTown(town).units()[unit], 10);
                                    groupUnitArray[group][unit] += tmp || 0;
                                    if (group == -1) {
                                        if (unit === "bireme" && ((biriArray[townArray[town].id] || 0) < (tmp || 0))) {
                                            biriArray[townArray[town].id] = tmp;
                                        }
                                        if (!uw.GameData.units[unit].is_naval) {
                                            if (uw.GameData.units[unit].flying) {
                                                type.fd += ((uw.GameData.units[unit].def_hack + uw.GameData.units[unit].def_pierce + uw.GameData.units[unit].def_distance) / 3 * (tmp || 0));
                                                type.fo += (uw.GameData.units[unit].attack * (tmp || 0));
                                            } else {
                                                type.ld += ((uw.GameData.units[unit].def_hack + uw.GameData.units[unit].def_pierce + uw.GameData.units[unit].def_distance) / 3 * (tmp || 0));
                                                type.lo += (uw.GameData.units[unit].attack * (tmp || 0));
                                            }
                                        } else {
                                            type.sd += (uw.GameData.units[unit].defense * (tmp || 0));
                                            type.so += (uw.GameData.units[unit].attack * (tmp || 0));
                                        }
                                    }
                                }
                            }
                            if (group == -1) {
                                var z = ((type.sd + type.ld + type.fd) <= (type.so + type.lo + type.fo)) ? "o" : "d",
                                    temp = 0;
                                for (var t in type) {
                                    if (type.hasOwnProperty(t)) {
                                        if (temp < type[t]) {
                                            autoTownTypes[townArray[town].id] = t[0] + z;
                                            temp = type[t];
                                        }
                                        if (temp < 1000) {
                                            autoTownTypes[townArray[town].id] = "no";
                                        }
                                    }
                                }
                                var popBuilding = 0,
                                    buildVal = uw.GameData.buildings,
                                    levelArray = townArray[town].buildings().getLevels(),
                                    popMax = Math.floor(buildVal.farm.farm_factor * Math.pow(townArray[town].buildings().getBuildingLevel("farm"), buildVal.farm.farm_pow)), // Population from farm level
                                    popPlow = townArray[town].getResearches().attributes.plow ? 200 : 0,
                                    popFactor = townArray[town].getBuildings().getBuildingLevel("thermal") ? 1.1 : 1.0, // Thermal
                                    popExtra = townArray[town].getPopulationExtra();
                                for (var b in levelArray) {
                                    if (levelArray.hasOwnProperty(b)) {
                                        popBuilding += Math.round(buildVal[b].pop * Math.pow(levelArray[b], buildVal[b].pop_factor));
                                    }
                                }
                                population[town] = {};
                                population[town].max = popMax * popFactor + popPlow + popExtra;
                                population[town].buildings = popBuilding;
                                population[town].units = parseInt((population[town].max - (popBuilding + townArray[town].getAvailablePopulation())), 10);
                                if (population[town].units < 300) {
                                    autoTownTypes[townArray[town].id] = "po";
                                }
                                population[town].percent = Math.round(100 / (population[town].max - popBuilding) * population[town].units);
                            }
                        }
                    }
                }
            }
            AvailableUnits.updateBullseye();
            if (GPWindowMgr.TYPE_JOE_UNITS) {
                if (Layout.wnd.getOpenFirst(GPWindowMgr.TYPE_JOE_UNITS)) {
                    AvailableUnits.updateWindow();
                }
            }
        } catch (error) {
            errorHandling(error, "getAllUnits");
        }
    }
    function addFunctionToITowns() {
        uw.ITowns.townGroups.getGroupsJOE = function() {
            var town_groups_towns, town_groups, groups = {};
            if (MM.collections) {
                town_groups_towns = MM.collections.TownGroupTown[0];
                town_groups = MM.collections.TownGroup[0];
            } else {
                town_groups_towns = MM.getCollections().TownGroupTown[0];
                town_groups = MM.getCollections().TownGroup[0];
            }
            town_groups_towns.each(function(town_group_town) {
                var gid = town_group_town.getGroupId(),
                    group = groups[gid],
                    town_id = town_group_town.getTownId();
                if (!group) {
                    groups[gid] = group = {
                        id: gid,
                        towns: {}
                    };
                }
                group.towns[town_id] = {
                    id: town_id
                };
            });
            return groups;
        };
        uw.ITowns.getHeroJOE = function() {
            var town_groups_towns, town_groups, groups = {};
            if (MM.collections) {
                PlayerHero = MM.collections.PlayerHero[0];
            } else {
                PlayerHero = MM.getCollections().PlayerHero[0];
            }
            PlayerHero.each(function(PlayerHero) {
                var hero_name = PlayerHero.getId(),
                    hero_level = PlayerHero.getLevel(),
                    town_id = PlayerHero.getHomeTownId(),
                    town_name = PlayerHero.getOriginTownName(),
                    group = groups[town_id];
                if (!group) {
                    groups[town_id] = group = {
                        town_id: town_id,
                        town: town_name,
                        hero_name,
                        hero_level: hero_level
                    };
                }
            });
            return groups;
        };
    }
    var UnitCounter = {
        units: {
            "total": {},
            "available": {},
            "outer": {},
            "foreign": {},
            "support": {}
        },
        count: function() {
            var tooltipHelper = require("helpers/units_tooltip_helper");
            var groups = uw.ITowns.townGroups.getGroupsJOE();
            for (var groupId in groups) {
                if (groups.hasOwnProperty(groupId)) {
                    UnitCounter.units.total[groupId] = {};
                    UnitCounter.units.available[groupId] = {};
                    UnitCounter.units.outer[groupId] = {};
                    UnitCounter.units.support[groupId] = {};
                    for (var townId in groups[groupId].towns) {
                        if (groups[groupId].towns.hasOwnProperty(townId)) {
                            UnitCounter.units.total[groupId][townId] = ITowns.towns[townId].units();
                            UnitCounter.units.available[groupId][townId] = ITowns.towns[townId].units();
                            UnitCounter.units.outer[groupId][townId] = {};
                            UnitCounter.units.support[groupId][townId] = ITowns.towns[townId].unitsSupport();
                            var supports = tooltipHelper.getDataForSupportingUnitsInOtherTownFromCollection(MM.getTownAgnosticCollectionsByName("Units")[1].fragments[townId], MM.getOnlyCollectionByName("Town"));
                            for (var supportId in supports) {
                                if (supports.hasOwnProperty(supportId)) {
                                    for (var attributeId in supports[supportId].attributes) {
                                        if (supports[supportId].attributes.hasOwnProperty(attributeId)) {
                                            if (typeof(GameData.units[attributeId]) !== "undefined" && supports[supportId].attributes[attributeId] > 0) {
                                                UnitCounter.units.outer[groupId][townId][attributeId] = (UnitCounter.units.outer[groupId][townId][attributeId] || 0) + supports[supportId].attributes[attributeId];
                                                UnitCounter.units.total[groupId][townId][attributeId] = (UnitCounter.units.total[groupId][townId][attributeId] || 0) + supports[supportId].attributes[attributeId];
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                    UnitCounter.summarize(groupId);
                }
            }
            return UnitCounter.units;
        },
        summarize: function(groupId) {
            var tooltipHelper = require("helpers/units_tooltip_helper");
            UnitCounter.units.total[groupId]["all"] = {};
            UnitCounter.units.available[groupId]["all"] = {};
            UnitCounter.units.outer[groupId]["all"] = {};
            UnitCounter.units.support[groupId]["all"] = {};
            for (var townId in UnitCounter.units.total[groupId]) {
                if (UnitCounter.units.total[groupId].hasOwnProperty(townId) && townId !== "all") {
                    for (var unitId in UnitCounter.units.total[groupId][townId]) {
                        if (UnitCounter.units.total[groupId][townId].hasOwnProperty(unitId)) {
                            UnitCounter.units.total[groupId]["all"][unitId] = (UnitCounter.units.total[groupId]["all"][unitId] || 0) + UnitCounter.units.total[groupId][townId][unitId];
                        }
                    }
                    for (var unitId in UnitCounter.units.available[groupId][townId]) {
                        if (UnitCounter.units.available[groupId][townId].hasOwnProperty(unitId)) {
                            UnitCounter.units.available[groupId]["all"][unitId] = (UnitCounter.units.available[groupId]["all"][unitId] || 0) + UnitCounter.units.available[groupId][townId][unitId];
                        }
                    }
                    for (var unitId in UnitCounter.units.outer[groupId][townId]) {
                        if (UnitCounter.units.outer[groupId][townId].hasOwnProperty(unitId)) {
                            UnitCounter.units.outer[groupId]["all"][unitId] = (UnitCounter.units.outer[groupId]["all"][unitId] || 0) + UnitCounter.units.outer[groupId][townId][unitId];
                        }
                    }
                    for (var unitId in UnitCounter.units.support[groupId][townId]) {
                        if (UnitCounter.units.support[groupId][townId].hasOwnProperty(unitId)) {
                            UnitCounter.units.support[groupId]["all"][unitId] = (UnitCounter.units.support[groupId]["all"][unitId] || 0) + UnitCounter.units.support[groupId][townId][unitId];
                        }
                    }
                }
            }
        }
    };
    var AvailableUnits = {
        activate: function() {
            var default_title = DM.getl10n("place", "support_overview").options.troop_count + " (" + DM.getl10n("hercules2014", "available") + ")";
            $(".picomap_container").prepend("<div id='available_units_bullseye' class='unit_icon90x90 " + (DATA.bullseyeUnit[DATA.bullseyeUnit.current_group] || "bireme") + "'><div class='amount'></div></div>");
            $('.picomap_overlayer').tooltip(getText("options", "ava")[0]);
            if ($(".topleft_navigation_area").get(0)) {
                $(".topleft_navigation_area").prepend("<div id='available_units_bullseye_addition' class='picomap_area'><div class='picomap_container'><div id='available_units_bullseye' class='unit_icon90x90 " + (DATA.bullseyeUnit[DATA.bullseyeUnit.current_group] || "bireme") + "'><div class='amount'></div></div></div><div class='picomap_overlayer'></div></div>");
                $('<style id="joe_available_units_style_addition">' +
                    '.coords_box { top: 117px !important; } ' +
                    '.nui_grepo_score { top: 150px !important; } ' +
                    '.nui_left_box { top: 102px ; } ' +
                    '#grcrt_mnu_list .nui_main_menu {top: 0px !important; }' +
                    '.bull_eye_buttons, .rb_map { height:38px !important; }' +
                    '#HMoleM {top: 253px !important;}' +
                    '#ui_box .btn_change_colors { top: 31px !important; }' +
                    '.picomap_area { position: absolute; overflow: visible; top: 0; left: 0; width: 156px; height: 161px; z-index: 5; }' +
                    '.picomap_area .picomap_container, .picomap_area .picomap_overlayer { position: absolute; top: 33px; left: -3px; width: 147px; height: 101px; }' +
                    '.picomap_area .picomap_overlayer { background: url(' + joe_sprite + '); background-position: 473px 250px; width: 147px; height: 101px; z-index: 5;} ' +
                    '</style>').appendTo('head');
                $('<style id="joe_available_units_style_addition_main_menu">.nui_main_menu { top: 260px ; }</style>').appendTo('head')
                if (DATA.options.occ) {
                    setTimeout(function() {
                        AvailableUnits.ocean.activate();
                    }, 100);
                }
            }
            $('<style id="joe_available_units_style">' +
                '#available_units .unit.index_unit.bold.unit_icon40x40:hover {-webkit-filter: brightness(1.1); box-shadow: 0px 0px 6px rgb(0 252 18);}' +
                '@-webkit-keyframes Z { 0% { opacity: 0; } 100% { opacity: 1; } } ' +
                '@keyframes Z { 0% { opacity: 0; } 100% { opacity: 1; } } ' +
                '@-webkit-keyframes blurr { 0% { -webkit-filter: blur(5px); } 100% { -webkit-filter: blur(0px); } } ' +
                '.picomap_overlayer { cursor:pointer; } ' +
                '.picomap_area .bull_eye_buttons { height: 55px; } ' +
                '#sea_id { background: none; font-size:25px; cursor:default; height:50px; width:50px; position:absolute; top:70px; left:157px; z-index: 30; } ' +
                '#available_units_bullseye { margin: 10px 28px 0px 28px; -webkit-animation: blur 2s; animation: Z 1s; } ' +
                '#available_units_bullseye .amount { color:#826021; position:relative; top:28px; font-style:italic; width:79px; font-weight: bold; text-shadow: 0px 0px 2px black, 1px 1px 2px black, 0px 2px 2px black; -webkit-animation: blur 3s; } ' +
                '#available_units_bullseye.big_number { font-size: 0.90em; line-height: 1.4; } ' +
                '#available_units_bullseye.blur { -webkit-animation: blurr 0.6s; } ' +
                '#available_units_bullseye.sword .amount { color:#E2D9C1; top:57px; width:90px;	} ' +
                '#available_units_bullseye.hoplite .amount { color:#E2D9C1; top:57px; width:90px;	} ' +
                '#available_units_bullseye.archer .amount	{ color:#E2D0C1; top:47px; width:70px;	} ' +
                '#available_units_bullseye.chariot { margin-top: 15px; } ' +
                '#available_units_bullseye.chariot .amount { color:#F5E8B4; top:38px; width:91px;  } ' +
                '#available_units_bullseye.rider .amount { color:#DFCC6C; top:52px; width:105px;	} ' +
                '#available_units_bullseye.slinger .amount { color:#F5E8B4; top:53px; width:91px;	} ' +
                '#available_units_bullseye.catapult .amount { color:#F5F6C5; top:36px; width:87px;	} ' +
                '#available_units_bullseye.godsent .amount { color:#F5F6C5; top:57px; width:92px;	} ' +
                '#available_units_bullseye.medusa .amount { color:#FBFFBB; top:50px; width:65px; } ' +
                '#available_units_bullseye.manticore .amount { color:#ECD181; top:50px; width:55px; 	} ' +
                '#available_units_bullseye.pegasus { margin-top: 16px; } ' +
                '#available_units_bullseye.pegasus .amount { color:#F7F8E3; top:36px; width:90px;	} ' +
                '#available_units_bullseye.minotaur { margin-top: 10px; } ' +
                '#available_units_bullseye.minotaur .amount	{ color:#EAD88A; top:48px; width:78px;	} ' +
                '#available_units_bullseye.zyklop { margin-top: 3px; } ' +
                '#available_units_bullseye.zyklop .amount	{ color:#EDE0B0; top:50px; width:95px; } ' +
                '#available_units_bullseye.harpy { margin-top: 16px; } ' +
                '#available_units_bullseye.harpy .amount	{ color:#E7DB79; top:30px; width:78px; } ' +
                '#available_units_bullseye.sea_monster .amount { color:#D8EA84; top:58px; width:91px;	} ' +
                '#available_units_bullseye.cerberus .amount { color:#EC7445; top:25px; width:101px; } ' +
                '#available_units_bullseye.centaur { margin-top: 15px; } ' +
                '#available_units_bullseye.centaur .amount { color:#ECE0A8; top:29px; width:83px;	} ' +
                '#available_units_bullseye.fury .amount { color:#E0E0BC; top:57px; width:95px; } ' +
                '#available_units_bullseye.griffin { margin-top: 15px; } ' +
                '#available_units_bullseye.griffin .amount { color:#FFDC9D; top:40px; width:98px;	} ' +
                '#available_units_bullseye.calydonian_boar .amount { color:#FFDC9D; top:17px; width:85px;	} ' +
                '#available_units_bullseye.siren .amount { color:#EAD88A; top:50px; width:78px; } ' +
                '#available_units_bullseye.satyr { margin-top: 15px; } ' +
                '#available_units_bullseye.satyr .amount { color:#EAD88A; top:48px; width:78px; } ' +
                '#available_units_bullseye.spartoi { margin-top: 10px; } ' +
                '#available_units_bullseye.spartoi .amount { color:#EAD88A; top:48px; width:78px;	} ' +
                '#available_units_bullseye.ladon { margin-top: 10px; } ' +
                '#available_units_bullseye.ladon .amount	{ color:#EAD88A; top:48px; width:78px; } ' +
                '#available_units_bullseye.attack_ship .amount { color:#FFCB00; top:26px; width:99px;	} ' +
                '#available_units_bullseye.bireme .amount	{ color:#DFC677; color:azure; top:28px; width:79px;	} ' +
                '#available_units_bullseye.trireme .amount { color:#F4FFD4; top:24px; width:90px;	} ' +
                '#available_units_bullseye.small_transporter .amount { color:#F5F6C5; top:26px; width:84px; } ' +
                '#available_units_bullseye.big_transporter .amount { color:#FFDC9D; top:27px; width:78px;	} ' +
                '#available_units_bullseye.colonize_ship .amount { color:#F5F6C5; top:29px; width:76px; } ' +
                '#available_units_bullseye.colonize_ship .amount { color:#F5F6C5; top:29px; width:76px; } ' +
                '#available_units_bullseye.demolition_ship .amount { color:#F5F6C5; top:35px; width:90px;	} ' +
                '#available_units { overflow: auto;  } ' +
                '#available_units .unit { margin: 5px; cursor:pointer; overflow:visible; display: -webkit-inline-box; float: none; } ' +
                '#available_units .unit.active { border: 2px solid #7f653a; border-radius:30px; margin:4px; } ' +
                '#available_units .unit span { text-shadow: 1px 1px 1px black, 1px 1px 2px black;} ' +
                '#available_units hr { margin: 5px 0px 5px 0px; } ' +
                '#available_units .drop_box .option { float: left; margin-right: 30px; width:100%; } ' +
                '#available_units .drop_box { position:absolute; top: -38px; right: 98px; width:120px; z-index:10; } ' +
                '#available_units .drop_box .drop_group { width: 140px; } ' +
                '#available_units .drop_box .select_group.open { display:block; } ' +
                '#available_units .drop_box .item-list { overflow: auto; overflow-x: hidden; } ' +
                '#available_units .drop_box .arrow { width:18px; height:18px; background:url(' + drop_out.src + ') no-repeat -1px -1px; position:absolute; } ' +
                '#btn_available_units { top:84px; left:120px; z-index:10; position:absolute; } ' +
                '#btn_available_units .ico_available_units { margin:5px 0px 0px 4px; width:24px; height:24px; ' +
                'background:url(https://i.imgur.com/RlSHFrr.png) no-repeat 0px 0px;background-size:100%; filter:url(#Hue1); -webkit-filter:hue-rotate(10deg);  } ' +
                '</style>').appendTo('head');
            if (Game.gods_active.aphrodite || Game.gods_active.ares) {
                createWindowType("JOE_UNITS", (LANG.hasOwnProperty(LID) ? getText("options", "ava")[0] : default_title), 417, 315, true, [240, 70]);
            } else {
                createWindowType("JOE_UNITS", (LANG.hasOwnProperty(LID) ? getText("options", "ava")[0] : default_title), 365, 315, true, [240, 70]);
            }
            $('#sea_id').prependTo('#ui_box');
            AvailableUnits.addButton();
            UnitCounter.count();
            AvailableUnits.updateBullseye();
        },
        ocean: {
            activate: function() {
                if (DATA.options.ava) {
                    $('<style id="joe_available_units_style_ocean">' +
                        '.coords_box { top: 115px !important; } ' +
                        '.nui_grepo_score { top: 166px !important; } ' +
                        '.nui_left_box { top: 119px !important; } ' +
                        '.nui_main_menu { top: 276px ; }' +
                        '#HMoleM {top: 270px !important;}' +
                        '#ui_box .ocean_number_box { position: absolute; top: 151px !important; left: 45px; }' +
                        '#ui_box .ocean_number_box .ocean_number { font-weight: 500; z-index: 5;}' +
                        '.picomap_area .picomap_overlayer { background-position: 473px 250px; width: 147px; height: 135px; } ' +
                        '</style>').appendTo('head');
                }
            },
            deactivate: function() {
                $('#joe_available_units_style_ocean').remove()
            },
        },
        deactivate: function() {
            $('#available_units_bullseye').remove();
            $('#available_units_bullseye_addition').remove();
            $('#joe_available_units_style_addition_main_menu').remove();
            $('#joe_available_units_style_ocean').remove();
            $('<style id="joe_HMoleM">#HMoleM {top: 210px !important;}</style>').appendTo('head');
            $('#joe_available_units_style').remove();
            $('#joe_available_units_style_addition').remove();
            $('#btn_available_units').remove();
            if (Layout.wnd.getOpenFirst(GPWindowMgr.TYPE_JOE_UNITS)) {
                Layout.wnd.getOpenFirst(GPWindowMgr.TYPE_JOE_UNITS).close();
            }
            $('.picomap_overlayer').unbind();
            $('#sea_id').appendTo('.picomap_container')
            $('#joe_available_units_style_ocean').remove()
        },
        addButton: function() {
            var default_title = DM.getl10n("place", "support_overview").options.troop_count + " (" + DM.getl10n("hercules2014", "available") + ")";
            $('<div id="btn_available_units" class="circle_button"><div class="ico_available_units js-caption"></div></div>').appendTo(".bull_eye_buttons");
            $('#btn_available_units').on('mousedown', function() {
                $('#btn_available_units, .ico_available_units').addClass("checked");
            }).on('mouseup', function() {
                $('#btn_available_units, .ico_available_units').removeClass("checked");
            });
            $('#btn_available_units, .picomap_overlayer').click(function() {
                if (!Layout.wnd.getOpenFirst(GPWindowMgr.TYPE_JOE_UNITS)) {
                    AvailableUnits.openWindow();
                    $('#btn_available_units, .ico_available_units').addClass("checked");
                } else {
                    AvailableUnits.closeWindow();
                    $('#btn_available_units, .ico_available_units').removeClass("checked");
                }
            });
            $('#btn_available_units').tooltip(LANG.hasOwnProperty(LID) ? joe_icon + getText("labels", "uni") : default_title);
        },
        openWindow: function() {
            var groupArray = uw.ITowns.townGroups.getGroupsJOE(),
                unitArray = {
                    "sword": 0,
                    "archer": 0,
                    "hoplite": 0,
                    "slinger": 0,
                    "rider": 0,
                    "chariot": 0,
                    "catapult": 0,
                    "godsent": 0,
                    "manticore": 0,
                    "harpy": 0,
                    "pegasus": 0,
                    "griffin": 0,
                    "cerberus": 0,
                    "minotaur": 0,
                    "medusa": 0,
                    "zyklop": 0,
                    "centaur": 0,
                    "calydonian_boar": 0,
                    "fury": 0,
                    "sea_monster": 0,
                    "spartoi": 0,
                    "ladon": 0,
                    "satyr": 0,
                    "siren": 0,
                    "small_transporter": 0,
                    "big_transporter": 0,
                    "bireme": 0,
                    "attack_ship": 0,
                    "trireme": 0,
                    "demolition_ship": 0,
                    "colonize_ship": 0
                };
            if (!groupArray[DATA.bullseyeUnit.current_group]) {
                DATA.bullseyeUnit.current_group = -1;
            }
            if (!uw.Game.hasArtemis) {
                delete unitArray.calydonian_boar;
                delete unitArray.griffin;
            }
            if (!Game.gods_active.aphrodite) {
                delete unitArray.siren;
                delete unitArray.satyr;
            }
            if (!Game.gods_active.ares) {
                delete unitArray.spartoi;
                delete unitArray.ladon;
            }
            var land_units_str = "",
                content =
                '<div id="available_units">' +
                '<div class="drop_box">' +
                '<div class="drop_group dropdown default">' +
                '<div class="border-left"></div><div class="border-right"></div>' +
                '<div class="caption" name="' + DATA.bullseyeUnit.current_group + '">' + ITowns.town_groups._byId[DATA.bullseyeUnit.current_group].attributes.name + '</div>' +
                '<div class="arrow"></div>' +
                '</div>' +
                '<div class="select_group dropdown-list default active"><div class="item-list"></div></div>' +
                '</div>' +
                '<table width="100%" class="radiobutton horizontal rbtn_visibility"><tr>' +
                '<td width="25%"><div class="option js-option" name="total"><div class="pointer"></div>' + getText("labels", "total") + '</div></td>' +
                '<td width="25%"><div class="option js-option" name="available"><div class="pointer"></div>' + getText("labels", "available") + '</div></td>' +
                '<td width="25%"><div class="option js-option" name="outer"><div class="pointer"></div>' + getText("labels", "outer") + '</div></td>' +
                '</tr></table>' +
                '<hr>' +
                '<div id="joe_help_available_units" style="top: -37px;position: absolute; right: 33px;">' +
                '<a class="ui-dialog-titlebar-help ui-corner-all" href=https://wiki.en.grepolis.com/wiki/Units_Portal' + getText("link", "available_units") + ' target="_blank"></a>' +
                '</div>' +
                '<div class="box_content">';
            for (var unit in unitArray) {
                if (unitArray.hasOwnProperty(unit)) {
                    land_units_str += '<div id="JOE' + unit + '" class="unit index_unit bold unit_icon40x40 ' + unit + '"></div>';
                    if (Game.gods_active.aphrodite) {
                        if (unit == "siren") {
                            land_units_str += '<div style="clear:left;"></div>'; // break
                        }
                    } else if (Game.gods_active.ares) {
                        if (unit == "ladon") {
                            land_units_str += '<div style="clear:left;"></div>';
                        }
                    } else if (unit == "sea_monster") {
                        land_units_str += '<div style="clear:left;"></div>';
                    }
                }
            }
            content += land_units_str + '</div></div>';
            AvailableUnits.wnd = Layout.wnd.Create(GPWindowMgr.TYPE_JOE_UNITS);
            AvailableUnits.wnd.setContent(content);
            if (Game.premium_features.curator <= Timestamp.now()) {
                $('#available_units .drop_box').css({
                    display: 'none'
                });
                DATA.bullseyeUnit.current_group = -1;
            }
            for (var group in groupArray) {
                if (groupArray.hasOwnProperty(group)) {
                    if (ITowns.town_groups._byId[group]) {
                        var group_name = ITowns.town_groups._byId[group].attributes.name;
                        $('<div class="option' + (group == -1 ? " sel" : "") + '" name="' + group + '">' + group_name + '</div>').appendTo('#available_units .item-list');
                    }
                }
            }
            if (typeof(DATA.bullseyeUnit.mode) !== "undefined") {
                $('#available_units .radiobutton .option[name="' + DATA.bullseyeUnit.mode + '"]').addClass("checked");
            } else {
                $('#available_units .radiobutton .option[name="available"]').addClass("checked");
            }
            AvailableUnits.updateWindow();
            $('#available_units .drop_group').click(function() {
                $('#available_units .select_group').toggleClass('open');
            });
            $('#available_units .select_group .option').click(function() {
                DATA.bullseyeUnit.current_group = $(this).attr("name");
                $('#available_units .select_group').removeClass('open');
                $('#available_units .select_group .option.sel').removeClass("sel");
                $(this).addClass("sel");
                $('#available_units .drop_group .caption').attr("name", DATA.bullseyeUnit.current_group);
                $('#available_units .drop_group .caption').get(0).innerHTML = this.innerHTML;
                $('#available_units .unit.active').removeClass("active");
                $('#available_units .unit.' + (DATA.bullseyeUnit[DATA.bullseyeUnit.current_group] || "bireme")).addClass("active");
                UnitCounter.count();
                AvailableUnits.updateWindow();
                AvailableUnits.updateBullseye();
                AvailableUnits.save();
            });
            $('#available_units .radiobutton .option').click(function() {
                DATA.bullseyeUnit.mode = $(this).attr("name");
                $('#available_units .radiobutton .option.checked').removeClass("checked");
                $(this).addClass("checked");
                UnitCounter.count();
                AvailableUnits.updateWindow();
                AvailableUnits.updateBullseye();
                AvailableUnits.save();
            });
            $('#available_units .unit.' + (DATA.bullseyeUnit[DATA.bullseyeUnit.current_group] || "bireme")).addClass("active");
            $('#available_units .unit').click(function() {
                DATA.bullseyeUnit[DATA.bullseyeUnit.current_group] = this.className.split(" ")[4].trim();
                $('#available_units .unit.active').removeClass("active");
                $(this).addClass("active");
                AvailableUnits.updateBullseye();
                AvailableUnits.save();

            });
            Layout.wnd.getOpenFirst(GPWindowMgr.TYPE_JOE_UNITS).getJQCloseButton().get(0).onclick = function() {
                $('#btn_available_units, .ico_available_units').removeClass("checked");
            };
            $('#joe_help_available_units').tooltip('Wiki (' + getText("options", "ava")[0] + ')');
            for (var unit in unitArray) {
                if (unitArray.hasOwnProperty(unit)) {
                    $('#joe' + unit).tooltip(uw.GameData.units[unit].name);
                }
            }
        },
        closeWindow: function() {
            Layout.wnd.getOpenFirst(GPWindowMgr.TYPE_JOE_UNITS).close();
        },
        save: function() {
            saveValue(WID + "_bullseyeUnit", JSON.stringify(DATA.bullseyeUnit));
        },
        updateBullseye: function() {
            var sum = 0,
                str = "",
                fsize = ['1.4em', '1.2em', '1.15em', '1.1em', '1.0em', '0.95em'],
                i;
            if ($('#available_units_bullseye').get(0)) {
                $('#available_units_bullseye').get(0).className = "unit_icon90x90 " + (DATA.bullseyeUnit[DATA.bullseyeUnit.current_group] || "bireme");
                if (UnitCounter.units[DATA.bullseyeUnit.mode || "available"][DATA.bullseyeUnit.current_group]) {
                    sum = UnitCounter.units[DATA.bullseyeUnit.mode || "available"][DATA.bullseyeUnit.current_group]["all"][(DATA.bullseyeUnit[DATA.bullseyeUnit.current_group] || "bireme")] || 0;
                }
                sum = sum.toString();
                for (i = 0; i < sum.length; i++) {
                    str += "<span style='font-size:" + fsize[i] + "'>" + sum[i] + "</span>";
                }
                $('#available_units_bullseye .amount').get(0).innerHTML = str;
                if (sum >= 100000) {
                    $('#available_units_bullseye').addClass("big_number");
                } else {
                    $('#available_units_bullseye').removeClass("big_number");
                }
            }
        },
        updateWindow: function() {
            $('#available_units .box_content .unit').each(function() {
                var unit = this.className.split(" ")[4];
                this.innerHTML = '<span style="font-size:0.9em">' + (UnitCounter.units[DATA.bullseyeUnit.mode || "available"][DATA.bullseyeUnit.current_group]["all"][unit] || 0) + '</span>';
            });
        }
    };
    ///////////////////////////////////
   //      * Comparison box *       //
  ///////////////////////////////////
    var UnitComparison = {
        activate: function() {
            UnitComparison.addButton();
            createWindowType("JOE_COMPARISON", getText("labels", "dsc"), 520, 405, true, ["center", "center", 100, 100]);
            $('<style id="joe_comparison_style"> ' +
                '.unit.index_unit.unit_icon40x40:hover { filter: url(#Brightness11); -webkit-filter: brightness(1.1); box-shadow: 0px 0px 16px rgb(1 197 33); } ' +
                '#joe_comparison_button { top:51px; left:120px; z-index:10; position:absolute; } ' +
                '#joe_comparison_button .ico_comparison { margin:5px 0px 0px 4px; width:24px; height:24px; ' +
                'background:url(https://i.imgur.com/JO06hvi.png) no-repeat 0px 0px; background-size:100%; filter:url(#Hue1); -webkit-filter:hue-rotate(60deg); } ' +
                '#joe_comparison_button.checked .ico_comparison { margin-top:6px; } ' +
                '#joe_comparison a { float:left; background-repeat:no-repeat; background-size:25px; line-height:2; margin-right:10px; } ' +
                '#joe_comparison .box_content { text-align:center; font-style:normal; } ' +
                '#joe_comparison_menu .tab_icon { left: 23px;} ' +
                '#joe_comparison_menu .tab_label { margin-left: 18px; } ' +
                '#joe_comparison .hidden { display:none; } ' +
                '#joe_comparison table { width:520px; } ' +
                '#joe_comparison .hack .t_hack, #joe_comparison .pierce .t_pierce, #joe_comparison .distance .t_distance, #joe_comparison .sea .t_sea { display:inline-table; } ' +
                '#joe_comparison .box_content { background:url(https://i.imgur.com/ZokrwGJ.png) 94% 94% no-repeat; background-size:140px; } ' +
                '#joe_comparison .compare_type_icon { height:25px; width:25px; background:url(https://i.imgur.com/Eh2qca2.png); background-size:100%; } ' +
                '#joe_comparison .compare_type_icon.booty { background:url(https://i.imgur.com/0b8lJGF.png); background-size:100%; } ' +
                '#joe_comparison .compare_type_icon.time { background:url(https://i.imgur.com/4pXZiwH.png); background-size:100%; } ' +
                '#joe_comparison .compare_type_icon.favor { background:url(https://i.imgur.com/FFl3t2I.png); background-size:100%; } ' +
                '#joe_comparison .compare_type_icon.wood { background:url(https://gpall.innogamescdn.com/images/game/res/wood.png); background-size:100%; } ' +
                '#joe_comparison .compare_type_icon.stone { background:url(https://gpall.innogamescdn.com/images/game/res/stone.png); background-size:100%; } ' +
                '#joe_comparison .compare_type_icon.iron { background:url(https://gpall.innogamescdn.com/images/game/res/iron.png); background-size:100%; } ' +
                '.icon_small2 { position:relative; height:20px; width:25px; margin-left:-25px; }' +
                '</style>').appendTo("head");
        },
        deactivate: function() {
            $('#joe_comparison_button').remove();
            $('#joe_comparison_style').remove();
            if (Layout.wnd.getOpenFirst(GPWindowMgr.TYPE_JOE_COMPARISON)) {
                Layout.wnd.getOpenFirst(GPWindowMgr.TYPE_JOE_COMPARISON).close();
            }
        },
        addButton: function() {
            $('<div id="joe_comparison_button" class="circle_button"><div class="ico_comparison js-caption"></div></div>').appendTo(".bull_eye_buttons");
            $('#joe_comparison_button').on('click', function() {
                if (!Layout.wnd.getOpenFirst(GPWindowMgr.TYPE_JOE_COMPARISON)) {
                    UnitComparison.openWindow();
                    $('#joe_comparison_button').addClass("checked");
                } else {
                    UnitComparison.closeWindow();
                    $('#joe_comparison_button').removeClass("checked");
                }
            });
            $('#joe_comparison_button').tooltip(joe_icon + getText("labels", "dsc"));
        },
        openWindow: function() {
            var content =
                '<ul id="joe_comparison_menu" class="menu_inner" style="top: -36px; right: 54px;">' +
                '<li><a class="submenu_link sea" href="#"><span class="left"><span class="right"><span class="middle">' +
                '<span class="tab_icon icon_small townicon_so"></span><span class="tab_label">' + getText("labels", "sea") + '</span>' +
                '</span></span></span></a></li>' +
                '<li><a class="submenu_link distance" href="#"><span class="left"><span class="right"><span class="middle">' +
                '<span class="tab_icon icon_small townicon_di"></span><span class="tab_label">' + getText("labels", "dst") + '</span>' +
                '</span></span></span></a></li>' +
                '<li><a class="submenu_link pierce" href="#"><span class="left"><span class="right"><span class="middle">' +
                '<span class="tab_icon icon_small townicon_sh"></span><span class="tab_label">' + getText("labels", "prc") + '</span>' +
                '</span></span></span></a></li>' +
                '<li><a class="submenu_link hack active" href="#"><span class="left"><span class="right"><span class="middle">' +
                '<span class="tab_icon icon_small townicon_lo"></span><span class="tab_label">' + getText("labels", "hck") + '</span>' +
                '</span></span></span></a></li>' +
                '</ul>' +
                '<div id="joe_help_UnitComparison" style="top: -37px;position: absolute; right: 33px;">' +
                '<a class="ui-dialog-titlebar-help ui-corner-all" href=' + getText("link", "UnitComparison") + ' target="_blank"></a>' +
                '</div>' +
                '<div id="joe_comparison" style="margin-bottom:5px; font-style:italic;"><div class="box_content hack"></div></div>';
            Layout.wnd.Create(GPWindowMgr.TYPE_JOE_COMPARISON).setContent(content);
            UnitComparison.addComparisonTable("hack");
            UnitComparison.addComparisonTable("pierce");
            UnitComparison.addComparisonTable("distance");
            UnitComparison.addComparisonTable("sea");
            var labelArray = DM.getl10n("barracks"),
                labelAttack = DM.getl10n("context_menu", "titles").attack,
                labelDefense = DM.getl10n("place", "tabs")[0];
            $('.tr_att').tooltip(labelAttack);
            $('.tr_def').tooltip(labelDefense + " (Ø)");
            $('.tr_def_sea').tooltip(labelDefense);
            $('.tr_spd').tooltip(labelArray.tooltips.speed);
            $('.tr_bty').tooltip(labelArray.tooltips.booty.title);
            $('.tr_bty_sea').tooltip(labelArray.tooltips.ship_transport.title);
            $('.tr_res').tooltip(labelArray.costs + " (" +
                labelArray.cost_details.wood + " + " +
                labelArray.cost_details.stone + " + " +
                labelArray.cost_details.iron + ")"
            );
            $('.tr_woo').tooltip(labelArray.costs + " (" + labelArray.cost_details.wood + ")");
            $('.tr_sto').tooltip(labelArray.costs + " (" + labelArray.cost_details.stone + ")");
            $('.tr_iro').tooltip(labelArray.costs + " (" + labelArray.cost_details.iron + ")");
            $('.tr_fav').tooltip(labelArray.costs + " (" + labelArray.cost_details.favor + ")");
            $('.tr_tim').tooltip(labelArray.cost_details.buildtime_barracks + " (s)");
            $('.tr_tim_sea').tooltip(labelArray.cost_details.buildtime_docks + " (s)");
            UnitComparison.switchComparisonTables();
            Layout.wnd.getOpenFirst(GPWindowMgr.TYPE_JOE_COMPARISON).getJQCloseButton().get(0).onclick = function() {
                $('#joe_comparison_button').removeClass("checked");
                $('.ico_comparison').get(0).style.marginTop = "5px";
            };
        },
        closeWindow: function() {
            Layout.wnd.getOpenFirst(GPWindowMgr.TYPE_JOE_COMPARISON).close();
        },
        switchComparisonTables: function() {
            $('#joe_comparison_menu .hack, #joe_comparison_menu .pierce, #joe_comparison_menu .distance, #joe_comparison_menu .sea').click(function() {
                $('#joe_comparison .box_content').removeClass($('#joe_comparison .box_content').get(0).className.split(" ")[1]);
                $('#joe_comparison .box_content').addClass(this.className.split(" ")[1]);
                $('#joe_comparison_menu .active').removeClass("active");
                $(this).addClass("active");
            });
        },
        tooltips: [],
        t: 0,
        addComparisonTable: function(type) {
            var pos = {
                att: {
                    hack: "36%",
                    pierce: "27%",
                    distance: "45.5%",
                    sea: "72.5%"
                },
                def: {
                    hack: "18%",
                    pierce: "18%",
                    distance: "18%",
                    sea: "81.5%"
                }
            };
            var unitIMG = "https://gpall.innogamescdn.com/images/game/units/units_info_sprite2.51.png";
            var strArray = [
                "<td></td>",
                '<td><div class="compare_type_icon" style="background-position: 0% ' + pos.att[type] + ';"></div></td>',
                '<td><div class="compare_type_icon" style="background-position: 0% ' + pos.def[type] + ';"></div></td>',
                '<td><div class="compare_type_icon" style="background-position: 0% 63%;"></div></td>',
                (type !== "sea") ? '<td><div class="compare_type_icon booty"></div></td>' : '<td><div class="compare_type_icon" style="background-position: 0% 91%;"></div></td>',
                '<td><div class="compare_type_icon" style="background-position: 0% 54%;"></div></td>',
                '<td><div class="compare_type_icon favor"></div></td>',
                '<td><div class="compare_type_icon time"></div></td>',
                '<td><div class="compare_type_icon wood"></div></td>',
                '<td><div class="compare_type_icon stone"></div></td>',
                '<td><div class="compare_type_icon iron"></div></td>'
            ];
            for (var e in uw.GameData.units) {
                if (uw.GameData.units.hasOwnProperty(e)) {
                    var valArray = [];
                    if (type === (uw.GameData.units[e].attack_type || "sea") && (e !== "militia")) {
                        valArray.att = Math.round(uw.GameData.units[e].attack * 10 / uw.GameData.units[e].population) / 10;
                        valArray.def = Math.round(((uw.GameData.units[e].def_hack + uw.GameData.units[e].def_pierce + uw.GameData.units[e].def_distance) * 10) / (3 * uw.GameData.units[e].population)) / 10;
                        valArray.def = valArray.def || Math.round(uw.GameData.units[e].defense * 10 / uw.GameData.units[e].population) / 10;
                        valArray.speed = uw.GameData.units[e].speed;
                        valArray.booty = Math.round(((uw.GameData.units[e].booty) * 10) / uw.GameData.units[e].population) / 10;
                        valArray.booty = valArray.booty || Math.round(((uw.GameData.units[e].capacity ? uw.GameData.units[e].capacity + 6 : 0) * 10) / uw.GameData.units[e].population) / 10;
                        valArray.res = Math.round((uw.GameData.units[e].resources.wood + uw.GameData.units[e].resources.stone + uw.GameData.units[e].resources.iron) / (uw.GameData.units[e].population));
                        valArray.wood = Math.round((uw.GameData.units[e].resources.wood) / (uw.GameData.units[e].population));
                        valArray.stone = Math.round((uw.GameData.units[e].resources.stone) / (uw.GameData.units[e].population));
                        valArray.iron = Math.round((uw.GameData.units[e].resources.iron) / (uw.GameData.units[e].population));
                        valArray.favor = Math.round((uw.GameData.units[e].favor * 10) / uw.GameData.units[e].population) / 10;
                        valArray.time = Math.round(uw.GameData.units[e].build_time / uw.GameData.units[e].population);
                        valArray.heroStyle = "";
                        valArray.heroStyleIMG = "";
                        if (!uw.Game.hasArtemis && ((e === "griffin") || (e === "calydonian_boar"))) {
                            valArray.heroStyle = "color:black;opacity: 0.4;";
                            valArray.heroStyleIMG = "filter: url(#GrayScale); -webkit-filter:grayscale(100%);";
                        }
                        if (!Game.gods_active.aphrodite && ((e === "siren") || (e === "satyr"))) {
                            valArray.heroStyle = "display: none;";
                        }
                        if (!Game.gods_active.ares && ((e === "spartoi") || (e === "ladon"))) {
                            valArray.heroStyle = "display: none;";
                        }
                        strArray[0] += '<td class="un' + (UnitComparison.t) + '"style="' + valArray.heroStyle + '"><span class="unit index_unit unit_icon40x40 ' + e + '" style="' + valArray.heroStyle + valArray.heroStyleIMG + '"></span></td>';
                        strArray[1] += '<td class="bold" style="color:' + ((valArray.att > 19) ? 'green;' : ((valArray.att < 10 && valArray.att !== 0) ? 'red;' : 'black;')) + valArray.heroStyle + '">' + valArray.att + '</td>';
                        strArray[2] += '<td class="bold" style="color:' + ((valArray.def > 19) ? 'green;' : ((valArray.def < 10 && valArray.def !== 0) ? 'red;' : 'black;')) + valArray.heroStyle + '">' + valArray.def + '</td>';
                        strArray[3] += '<td class="bold" style="' + valArray.heroStyle + '">' + valArray.speed + '</td>';
                        strArray[4] += '<td class="bold" style="' + valArray.heroStyle + '">' + valArray.booty + '</td>';
                        strArray[5] += '<td class="bold" style="' + valArray.heroStyle + '">' + valArray.res + '</td>';
                        strArray[8] += '<td class="bold" style="' + valArray.heroStyle + '">' + valArray.wood + '</td>';
                        strArray[9] += '<td class="bold" style="' + valArray.heroStyle + '">' + valArray.stone + '</td>';
                        strArray[10] += '<td class="bold" style="' + valArray.heroStyle + '">' + valArray.iron + '</td>';
                        strArray[6] += '<td class="bold" style="color:' + ((valArray.favor > 0) ? 'rgb(0, 0, 214);' : 'black;') + valArray.heroStyle + ';">' + valArray.favor + '</td>';
                        strArray[7] += '<td class="bold" style="' + valArray.heroStyle + '">' + valArray.time + '</td>';
                        UnitComparison.tooltips[UnitComparison.t] = uw.GameData.units[e].name;
                        UnitComparison.t++;
                        $('#joe_help_UnitComparison').tooltip('Wiki (' + getText("options", "com")[0] + ')');
                    }
                }
            }
            $('<table class="hidden t_' + type + '" cellpadding="1px">' +
                '<tr>' + strArray[0] + '</tr>' +
                '<tr class="tr_att">' + strArray[1] + '</tr><tr class="tr_def' + (type == "sea" ? "_sea" : "") + '">' + strArray[2] + '</tr>' +
                '<tr class="tr_spd">' + strArray[3] + '</tr><tr class="tr_bty' + (type == "sea" ? "_sea" : "") + '">' + strArray[4] + '</tr>' +
                '<tr class="tr_res">' + strArray[5] + '</tr><tr class="tr_woo">' + strArray[8] + '</tr>' +
                '<tr class="tr_sto">' + strArray[9] + '</tr><tr class="tr_iro">' + strArray[10] + '</tr>' +
                '<tr class="tr_fav">' + strArray[6] + '</tr><tr class="tr_tim' + (type == "sea" ? "_sea" : "") + '">' + strArray[7] + '</tr>' +
                '</table>').appendTo('#joe_comparison .box_content');
            for (var i = 0; i <= UnitComparison.t; i++) {
                $('.un' + i).tooltip(UnitComparison.tooltips[i]);
            }
        }
    };
    ///////////////////////////////////
   //    * Reports and Messages *   //
  ///////////////////////////////////
    var filter = "all";
    function saveFilter() {
        $('#dd_filter_type_list .item-list div').each(function() {
            $(this).click(function() {
                filter = $(this).attr("name");
            });
        });

    }
    function loadFilter() {
        if ($('#dd_filter_type_list .selected').attr("name") !== filter) {
            $('#dd_filter_type .caption').click();
            $('#dd_filter_type_list .item-list div[name=' + filter + ']').click();
        }
    }
    function removeReports() {
        $("#report_list li:contains('spioniert')").each(function() {});
    }
    var zut = 0;
    var messageArray = {};
    function filterPlayer() {
        if (!$('#message_filter_list').get(0)) {
            $('<div id="message_filter_list" style="height:300px;overflow-y:scroll; width: 790px;"></div>').appendTo('#folder_container');
            $("#message_list").get(0).style.display = "none";
        }
        if (zut < parseInt($('.es_last_page').get(0).value, 10) - 1) {
            $('.es_page_input').get(0).value = zut++;
            $('.jump_button').click();
            $("#message_list li:contains('')").each(function() {
                $(this).appendTo('#message_filter_list');
            });
        } else {
            zut = 1;
        }
    }
    ///////////////////////////////////
   //    * World Wonder Ranking *   //
  ///////////////////////////////////
    function getWorldWonderTypes() {
        $.ajax({
            type: "GET",
            url: "/game/alliance?town_id=" + uw.Game.town_id + "&action=world_wonders&h=" + uw.Game.csrfToken + "&json=%7B%22town_id%22%3A" + uw.Game.town_id + "%2C%22nlreq_id%22%3A" + uw.Game.notification_last_requested_id +
                "%7D&_=" + uw.Game.server_time,
            success: function(text) {
                try {
                    temp = JSON.parse(text).json.data.world_wonders;
                    for (var t in temp) {
                        if (temp.hasOwnProperty(t)) {
                            wonderTypes[temp[t].wonder_type] = temp[t].full_name;
                        }
                    }
                    temp = JSON.parse(text).json.data.buildable_wonders;
                    for (var x in temp) {
                        if (temp.hasOwnProperty(x)) {
                            wonderTypes[x] = temp[x].name;
                        }
                    }
                    saveValue(MID + "_wonderTypes", JSON.stringify(wonderTypes));
                } catch (error) {
                    errorHandling(error, "getWorldWonderTypes");
                }
            }
        });
    }
    function getWorldWonders() {
        $.ajax({
            type: "GET",
            url: "/game/ranking?town_id=" + uw.Game.town_id + "&action=wonder_alliance&h=" + uw.Game.csrfToken + "&json=%7B%22type%22%3A%22all%22%2C%22town_id%22%3A" + uw.Game.town_id + "%2C%22nlreq_id%22%3A3" + uw.Game.notification_last_requested_id +
                "%7D&_=" + uw.Game.server_time
        });
    }
    var WorldWonderRanking = {
        activate: function() {
            if ($('#joe_wonder_ranking').get(0)) {
                $('#joe_wonder_ranking').remove();
            }
            $('<style id="joe_wonder_ranking" type="text/css"> .wonder_ranking { display: none; } </style>').appendTo('head');
        },
        deactivate: function() {
            if ($('#joe_wonder_ranking').get(0)) {
                $('#joe_wonder_ranking').remove();
            }
            $('<style id="joe_wonder_ranking" type="text/css"> .wonder_ranking { display: block; } </style>').appendTo('head');
        },
        change: function(html) {
            if ($('#ranking_inner tr', html)[0].children.length !== 1) { // world wonders exist?
                try {
                    var ranking = {},
                        temp_ally, temp_ally_id, temp_ally_link;
                    $('#ranking_inner tr', html).each(function() {
                        try {
                            if (this.children[0].innerHTML) {
                                temp_ally = this.children[1].children[0].innerHTML; // das hier
                                temp_ally_id = this.children[1].children[0].onclick.toString();
                                temp_ally_id = temp_ally_id.substring(temp_ally_id.indexOf(",") + 1);
                                temp_ally_id = temp_ally_id.substring(0, temp_ally_id.indexOf(")"));
                                temp_ally_link = this.children[1].innerHTML;
                            } else {
                                var wonder_name = this.children[3].children[0].innerHTML;
                                for (var w in wonderTypes) {
                                    if (wonderTypes.hasOwnProperty(w)) {
                                        if (wonder_name == wonderTypes[w]) {
                                            var level = this.children[4].innerHTML,
                                                ww_data = JSON.parse(atob(this.children[3].children[0].href.split("#")[1])),
                                                wonder_link;
                                            if (!ranking.hasOwnProperty(level)) {
                                                ranking[level] = {
                                                    colossus_of_rhodes: {},
                                                    great_pyramid_of_giza: {},
                                                    hanging_gardens_of_babylon: {},
                                                    lighthouse_of_alexandria: {},
                                                    mausoleum_of_halicarnassus: {},
                                                    statue_of_zeus_at_olympia: {},
                                                    temple_of_artemis_at_ephesus: {}
                                                };
                                            }
                                            if (!ranking[level][w].hasOwnProperty(temp_ally_id)) {
                                                ranking[level][w][temp_ally_id] = {};
                                            }
                                            ranking[level][w][temp_ally_id].ix = ww_data.ix;
                                            ranking[level][w][temp_ally_id].iy = ww_data.iy;
                                            ranking[level][w][temp_ally_id].sea = this.children[5].innerHTML;
                                            wonder_link = this.children[3].innerHTML;
                                            if (temp_ally.length > 15) {
                                                temp_ally = temp_ally.substring(0, 15) + '.';
                                            }
                                            wonder_link = wonder_link.substr(0, wonder_link.indexOf(">") + 1) + temp_ally + '</a>';
                                            ranking[level][w][temp_ally_id].ww_link = wonder_link;
                                            ranking[level][w][temp_ally_id].ally_link = temp_ally_link;
                                            ranking[level][w][temp_ally_id].ally_name = temp_ally;
                                            ranking[level][w][temp_ally_id].name = wonder_name;
                                            if (!wonder.map[w]) {
                                                wonder.map[w] = {};
                                            }
                                            wonder.map[w][ww_data.ix + "_" + ww_data.iy] = level;
                                            saveValue(WID + "_wonder", JSON.stringify(wonder));
                                        }
                                    }
                                }
                            }
                        } catch (error) {
                            errorHandling(error, "WorldWonderRanking.change(function)");
                        }
                    });
                    if ($('#ranking_table_wrapper').get(0)) {
                        $('#ranking_fixed_table_header').get(0).innerHTML = '<tr>' +
                            '<td style="width:10px">#</td>' +
                            '<td>Colossus</td>' +
                            '<td>Pyramid</td>' +
                            '<td>Garden</td>' +
                            '<td>Lighthouse</td>' +
                            '<td>Mausoleum</td>' +
                            '<td>Statue</td>' +
                            '<td>Temple</td>' +
                            '</tr>';
                        $('#ranking_fixed_table_header').css({
                            tableLayout: 'fixed',
                            width: '100%',
                            paddingRight: '15px'
                        });
                        var ranking_substr = '',
                            z = 0;
                        for (var level = 10; level >= 1; level--) {
                            if (ranking.hasOwnProperty(level)) {
                                var complete = "";
                                if (level == 10) {
                                    complete = "background: rgba(255, 236, 108, 0.36);";
                                }
                                if (z === 0) {
                                    ranking_substr += '<tr class="game_table_odd" style="' + complete + '"><td style="border-right: 1px solid #d0be97;">' + level + '</td>';
                                    z = 1;
                                } else {
                                    ranking_substr += '<tr class="game_table_even" style="' + complete + '"><td style="border-right: 1px solid #d0be97;">' + level + '</td>';
                                    z = 0;
                                }
                                for (var w in ranking[level]) {
                                    if (ranking[level].hasOwnProperty(w)) {
                                        ranking_substr += '<td>';

                                        for (var a in ranking[level][w]) {
                                            if (ranking[level][w].hasOwnProperty(a)) {
                                                ranking_substr += '<nobr>' + ranking[level][w][a].ww_link + '</nobr><br />'; // ww link
                                            }
                                        }
                                        ranking_substr += '</td>';
                                    }
                                }
                                ranking_substr += '</tr>';
                            }
                        }
                        var ranking_str = '<table id="ranking_endless_scroll" class="game_table" cellspacing="0"><tr>' +
                            '<td style="width:10px;border-right: 1px solid #d0be97;"></td>' +
                            '<td><div class="joe_wonder" style="background:' + worldWonderIcon.colossus_of_rhodes + ';margin-left:26px"></div></td>' + // Colossus
                            '<td><div class="joe_wonder" style="background:' + worldWonderIcon.great_pyramid_of_giza + ';margin-left:19px"></div></td>' + // Pyramid
                            '<td><div class="joe_wonder" style="background:' + worldWonderIcon.hanging_gardens_of_babylon + ';margin-left:19px"></div></td>' + // Garden
                            '<td><div class="joe_wonder" style="background:' + worldWonderIcon.lighthouse_of_alexandria + ';margin-left:24px"></div></td>' + // Lighthouse
                            '<td><div class="joe_wonder" style="background:' + worldWonderIcon.mausoleum_of_halicarnassus + ';margin-left:25px"></div></td>' + // Mausoleum
                            '<td><div class="joe_wonder" style="background:' + worldWonderIcon.statue_of_zeus_at_olympia + ';margin-left:25px"></div></td>' + // Statue
                            '<td><div class="joe_wonder" style="background:' + worldWonderIcon.temple_of_artemis_at_ephesus + ';margin-left:22px"></div></td>' + // Temple
                            '</tr>' + ranking_substr + '</table>';
                        $('#ranking_table_wrapper').get(0).innerHTML = ranking_str;
                        $('#ranking_endless_scroll .joe_wonder').css({
                            width: "65px",
                            height: "60px",
                            backgroundSize: "auto 100%",
                            backgroundPosition: "64px 0px"
                        });
                        $('#ranking_endless_scroll').css({
                            tableLayout: 'fixed',
                            width: '100%',
                            overflowY: 'auto',
                            overflowX: 'hidden',
                            fontSize: '0.7em',
                            lineHeight: '2'
                        });
                        $('#ranking_endless_scroll tbody').css({
                            verticalAlign: 'text-top'
                        });
                        $('#ranking_table_wrapper img').css({
                            width: "60px"
                        });
                        $('#ranking_table_wrapper').css({
                            overflowY: 'scroll'
                        });
                    }
                } catch (error) {
                    errorHandling(error, "WorldWonderRanking.change");
                }
            }
            if ($('.wonder_ranking').get(0)) {
                $('.wonder_ranking').get(0).style.display = "block";
            }
        }
    };
    ///////////////////////////////////
   //       * World Wonder *        //
  ///////////////////////////////////
    function getPointRatioFromAllianceProfile() {
        if (AID) {
            $.ajax({
                type: "GET",
                url: '/game/alliance?town_id=' + uw.Game.townId + '&action=profile&h=' + uw.Game.csrfToken + '&json=%7B%22alliance_id%22%3A' + AID + '%2C%22town_id%22%3A' + uw.Game.townId +
                    '%2C%22nlreq_id%22%3A' + uw.Game.notification_last_requested_id + '%7D&_=' + uw.Game.server_time,
                success: function(text) {
                    try {
                        text = text.substr(text.indexOf("/li") + 14).substr(0, text.indexOf("\ "));
                        var AP = parseInt(text, 10);
                        wonder.ratio[AID] = 100 / AP * uw.Game.player_points;
                        saveValue(WID + "_wonder", JSON.stringify(wonder));
                    } catch (error) {
                        errorHandling(error, "getPointRatioFromAllianceProfile");
                    }
                }
            });
        } else {
            wonder.ratio[AID] = -1;
            saveValue(WID + "_wonder", JSON.stringify(wonder));
        }
    }
    function getPointRatioFromAllianceRanking() {
        try {
            if (AID && $('.current_player .r_points').get(0)) {
                wonder.ratio[AID] = 100 / parseInt($('.current_player .r_points').get(0).innerHTML, 10) * uw.Game.player_points;
                saveValue(WID + "_wonder", JSON.stringify(wonder));
            }
        } catch (error) {
            errorHandling(error, "getPointRatioFromAllianceRaking");
        }
    }
    function getPointRatioFromAllianceMembers() {
        try {
            var ally_points = 0;
            $('#ally_members_body tr').each(function() {
                ally_points += parseInt($(this).children().eq(2).text(), 10) || 0;
            });
            wonder.ratio[AID] = 100 / ally_points * uw.Game.player_points;
            saveValue(WID + "_wonder", JSON.stringify(wonder));
        } catch (error) {
            errorHandling(error, "getPointRatioFromAllianceMembers");
        }
    }
    var WorldWonderCalculator = {
        activate: function() {
            $('<style id="joe_wonder_calculator"> ' +
                '.finished_image_small_container { top: 10px; } ' +
                '.wonder_res_container { top: 15px; } ' +
                '.wonder_controls { height:420px; } ' +
                '.wonder_controls .wonder_progress { margin: 0px auto 5px; } ' +
                '.wonder_controls .wonder_header { text-align:left; margin:10px -8px 12px 3px; }' +
                '.wonder_controls .build_wonder_icon { top:25px !important; }' +
                '.wonder_controls .wonder_progress_bar { top:54px; }' +
                '.wonder_controls .trade fieldset { float:right; } ' +
                '.wonder_controls .wonder_res_container { right:29px; } ' +
                '.wonder_controls .ww_ratio {position:relative; height:auto; } ' +
                '.wonder_controls fieldset.next_level_res {  height:auto; } ' +
                '.wonder_controls .town-capacity-indicator { margin-top:0px; } ' +
                '.wonder_controls .ww_ratio .progress { line-height:1; color:white; font-size:0.8em; } ' +
                '.wonder_controls .ww_perc { position:absolute; width:242px; text-align:center; } ' +
                '.wonder_controls .indicator3 { z-index:0; } ' +
                '.wonder_controls .indicator3.red { background-position:right -203px; height:10px; width:242px; } ' +
                '.wonder_controls .indicator3.green { background-position:right -355px; height:10px; width:242px; } ' +
                '.wonder_controls .all_res { background:url(https://gpall.innogamescdn.com/images/game/layout/resources_2.32.png) no-repeat 0 -90px; width:30px; height:30px; margin:0 auto; margin-left:5px; } ' +
                '.wonder_controls .town-capacity-indicator { margin-top:0px; } ' +
                '</style>').appendTo('head');
        },
        deactivate: function() {
            $('#joe_wonder.button_new_calculator').remove();
            $('#joe_wonder_calculator').remove();
        }
    };
    function getResWW() {
        try {
            var wndArray = uw.GPWindowMgr.getOpen(uw.Layout.wnd.TYPE_WONDERS);
            for (var e in wndArray) {
                if (wndArray.hasOwnProperty(e)) {
                    var wndID = "#gpwnd_" + wndArray[e].getID() + " ";
                    if ($(wndID + '.wonder_progress').get(0)) {
                        var res = 0,
                            ww_share = {
                                total: {
                                    share: 0,
                                    sum: 0
                                },
                                stage: {
                                    share: 0,
                                    sum: 0
                                }
                            },
                            ww_type = $(wndID + '.finished_image_small').attr('src').split("/")[6].split("_")[0], // Which world wonder?
                            res_stages = [2, 4, 6, 10, 16, 28, 48, 82, 140, 238], // Rohstoffmenge pro Rohstofftyp in 100.000 Einheiten
                            stage = parseInt($(wndID + '.wonder_expansion_stage span').get(0).innerHTML.split("/")[0], 10) + 1, // Derzeitige Füllstufe
                            speed = uw.Game.game_speed;
                        wonder.storage[AID] = wonder.storage[AID] || {};
                        wonder.storage[AID][ww_type] = wonder.storage[AID][ww_type] || {};
                        wonder.storage[AID][ww_type][stage] = wonder.storage[AID][ww_type][stage] || 0;
                        if (!$(wndID + '.ww_ratio').get(0)) {
                            $('<fieldset class="ww_ratio"></fieldset>').appendTo(wndID + '.wonder_res_container .trade');
                            $(wndID + '.wonder_header').prependTo(wndID + '.wonder_progress');
                            $(wndID + '.wonder_res_container .send_res').insertBefore(wndID + '.wonder_res_container .next_level_res');
                        }
                        for (var d in res_stages) {
                            if (res_stages.hasOwnProperty(d)) {
                                ww_share.total.sum += res_stages[d];
                            }
                        }
                        ww_share.total.sum *= speed * 300000;
                        ww_share.total.share = parseInt(wonder.ratio[AID] * (ww_share.total.sum / 100), 10);
                        ww_share.stage.sum = speed * res_stages[stage - 1] * 300000;
                        ww_share.stage.share = parseInt(wonder.ratio[AID] * (ww_share.stage.sum / 100), 10); // ( 3000 = 3 Rohstofftypen * 100000 Rohstoffe / 100 Prozent)
                        setResWW(stage, ww_type, ww_share, wndID);
                        $(wndID + '.wonder_res_container .send_resources_btn').click(function(e) {
                            try {
                                wonder.storage[AID][ww_type][stage] += parseInt($(wndID + '#ww_trade_type_wood input:text').get(0).value, 10);
                                wonder.storage[AID][ww_type][stage] += parseInt($(wndID + '#ww_trade_type_stone input:text').get(0).value, 10);
                                wonder.storage[AID][ww_type][stage] += parseInt($(wndID + '#ww_trade_type_iron input:text').get(0).value, 10);
                                setResWW(stage, ww_type, ww_share, wndID);
                                saveValue(WID + "_wonder", JSON.stringify(wonder));
                            } catch (error) {
                                errorHandling(error, "getResWW_Click");
                            }
                        });

                    } else {
                        $('<div class="prev_ww pos_Y"></div><div class="next_ww pos_Y"></div>').appendTo(wndID + '.wonder_controls');
                        $(wndID + '.wonder_finished').css({
                            width: '100%'
                        });
                        $(wndID + '.pos_Y').css({
                            top: '-266px'
                        });
                    }
                }
            }
        } catch (error) {
            errorHandling(error, "getResWW");
        }
    }
    function setResWW(stage, ww_type, ww_share, wndID) {
        try {
            var stage_width, total_width, res_total = 0,
                stage_color = "red",
                total_color = "red";

            for (var z in wonder.storage[AID][ww_type]) {
                if (wonder.storage[AID][ww_type].hasOwnProperty(z)) {
                    res_total += wonder.storage[AID][ww_type][z];
                }
            }
            if (ww_share.stage.share > wonder.storage[AID][ww_type][stage]) {
                stage_width = (242 / ww_share.stage.share) * wonder.storage[AID][ww_type][stage];
                stage_color = "red";
            } else {
                stage_width = 242;
                stage_color = "green"
            }
            if (ww_share.total.share > res_total) {
                total_color = "red";
                total_width = (242 / ww_share.total.share) * res_total;
            } else {
                total_width = 242;
                total_color = "green"
            }
            $(wndID + '.ww_ratio').get(0).innerHTML = "";
            $(wndID + '.ww_ratio').append(
                '<legend>' + getText("labels", "leg") + ' (<span style="color:#090">' + (Math.round(wonder.ratio[AID] * 100) / 100) + '%</span>):</legend>' +
                '<div class="town-capacity-indicator">' +
                '<div class="icon all_res"></div>' +
                '<div id="ww_town_capacity_stadium" class="tripple-progress-progressbar">' +
                '<div class="border_l"></div><div class="border_r"></div><div class="body"></div>' +
                '<div class="progress overloaded">' +
                '<div class="indicator3 ' + stage_color + '" style="width:' + stage_width + 'px"></div>' +
                '<span class="ww_perc">' + Math.round(wonder.storage[AID][ww_type][stage] / ww_share.stage.share * 100) + '%</span>' +
                '</div>' +
                '<div class="amounts">' + getText("labels", "stg") + ': <span class="curr">' + pointNumber(wonder.storage[AID][ww_type][stage]) + '</span> / ' +
                '<span class="max">' + pointNumber(Math.round(ww_share.stage.share / 1000) * 1000) + '</span></div>' +
                '</div></div>' +
                '<div class="town-capacity-indicator">' +
                '<div class="icon all_res"></div>' +
                '<div id="ww_town_capacity_total" class="tripple-progress-progressbar">' +
                '<div class="border_l"></div><div class="border_r"></div><div class="body"></div>' +
                '<div class="progress overloaded">' +
                '<div class="indicator3 ' + total_color + '" style="width:' + total_width + 'px;"></div>' +
                '<span class="ww_perc">' + Math.round(res_total / ww_share.total.share * 100) + '%</span>' +
                '</div>' +
                '<div class="amounts">' + getText("labels", "tot") + ': <span class="curr">' + pointNumber(res_total) + '</span> / ' +
                '<span class="max">' + pointNumber((Math.round(ww_share.total.share / 1000) * 1000)) + '</span></div>' +
                '</div></div>');
            $(wndID + '.ww_ratio').tooltip(
                "<table style='border-spacing:0px; text-align:right' cellpadding='5px'><tr>" +
                "<td align='right' style='border-right: 1px solid;border-bottom: 1px solid'></td>" +
                "<td style='border-right: 1px solid; border-bottom: 1px solid'><span class='bbcodes_player bold'>(" + (Math.round((wonder.ratio[AID]) * 100) / 100) + "%)</span></td>" +
                "<td style='border-bottom: 1px solid'><span class='bbcodes_ally bold'>(100%)</span></td></tr>" +
                "<tr><td class='bold' style='border-right:1px solid;text-align:center'>" + getText("labels", "stg") + "&nbsp;" + stage + "</td>" +
                "<td style='border-right: 1px solid'>" + pointNumber(Math.round(ww_share.stage.share / 1000) * 1000) + "</td>" +
                "<td>" + pointNumber(Math.round(ww_share.stage.sum / 1000) * 1000) + "</td></tr>" +
                "<tr><td class='bold' style='border-right:1px solid;text-align:center'>" + getText("labels", "tot") + "</td>" +
                "<td style='border-right: 1px solid'>" + pointNumber(Math.round(ww_share.total.share / 1000) * 1000) + "</td>" +
                "<td>" + pointNumber(Math.round(ww_share.total.sum / 1000) * 1000) + "</td>" +
                "</tr></table>");
        } catch (error) {
            errorHandling(error, "setResWW");
        }
    }
    function pointNumber(number) {
        var sep;
        if (LID === "de") {
            sep = ".";
        } else {
            sep = ",";
        }
        number = number.toString();
        if (number.length > 3) {
            var mod = number.length % 3;
            var output = (mod > 0 ? (number.substring(0, mod)) : '');

            for (var i = 0; i < Math.floor(number.length / 3); i++) {
                if ((mod == 0) && (i == 0)) {
                    output += number.substring(mod + 3 * i, mod + 3 * i + 3);
                } else {
                    output += sep + number.substring(mod + 3 * i, mod + 3 * i + 3);
                }
            }
            number = output;
        }
        return number;
    }
    ///////////////////////////////////
   //  * Farming Village Overview * //
  ///////////////////////////////////
    function changeResColor() {
        var res, res_min, i = 0;
        $('#fto_town_list .fto_resource_count :last-child').reverseList().each(function() {
            if ($(this).parent().hasClass("stone")) {
                res_min = 18000;
            } else {
                res_min = 15000;
            }
            res = parseInt(this.innerHTML, 10);
            if ((res >= res_min) && !($(this).hasClass("town_storage_full"))) {
                this.style.color = '#0A0';
            }
            if (res < res_min) {
                this.style.color = '#000';
            }
        });
    }
    ///////////////////////////////////
   //    * Conquest Information *   //
  ///////////////////////////////////
    function countMovements() {
        var sup = 0,
            att = 0;
        $('.tab_content #unit_movements .support').each(function() {
            sup++;
        });
        $('.tab_content #unit_movements .attack_land, .tab_content #unit_movements .attack_sea, .tab_content #unit_movements .attack_takeover').each(function() {
            att++;
        });
        var str = "<div id='move_counter' style=''><div style='float:left;margin-right:5px;'></div>" +
            "<div class='movement def'></div>" +
            "<div class='movement' style='color:green;'> " + sup + "</div>" +
            "<div class='movement off'> </div>" +
            "<div style='color:red;'> " + att + "</div></div>" +
            "<hr class='move_hr'>";
        if ($('.gpwindow_content .tab_content .bold').get(0)) {
            $('.gpwindow_content .tab_content .bold').append(str);
        } else {
            $('.gpwindow_content h4:eq(1)').append(str);
        }
        $('<style id="joe_conquest"> ' +
            '.move_hr { margin:7px 0px 0px 0px; background-color:#5F5242; height:2px; border:0px solid; } ' +
            '#unit_movements { font-size: 0.80em; } ' +
            '#unit_movements .incoming { width:150px; height:45px; float:left; } ' +
            '#move_counter { position:relative; width:100px; margin-top:-16px; left: 40%; } ' +
            '#move_counter .movement { float:left; margin:0px 5px 0px 0px; height:18px; width:18px; position:relative; } ' +
            '#move_counter .def { background:url(https://gpall.innogamescdn.com/images/game/place/losts.png); background-position:0 -36px; } ' +
            '#move_counter .off { background:url(https://gpall.innogamescdn.com/images/game/place/losts.png); background-position:0 0px; }' +
            '</style>').appendTo("head");
    }
    ///////////////////////////////////
   //        * Town window *        //
  ///////////////////////////////////
    var arrival_interval = {};
    function TownTabHandler(action) {
        var wndArray, wndID, wndA;
        wndArray = Layout.wnd.getOpen(uw.Layout.wnd.TYPE_TOWN);
        for (var e in wndArray) {
            if (wndArray.hasOwnProperty(e)) {
                wndA = wndArray[e].getAction();
                wndID = "#gpwnd_" + wndArray[e].getID() + " ";
                if (!$(wndID).get(0)) {
                    wndID = "#gpwnd_" + (wndArray[e].getID() + 1) + " ";
                }
                if (wndA === action) {
                    switch (action) {
                        case "trading":
                            if ($(wndID + '#trade_tab').get(0)) {
                                if (!$(wndID + '.rec_trade').get(0) && DATA.options.rec) {
                                    RecruitingTrade.add(wndID);
                                }
                                if (!$(wndID + '.btn_trade').get(0) && DATA.options.per) {
                                    addPercentTrade(wndID, false);
                                }
                            }
                            break;
                        case "support":
                        case "attack":
                            if (DATA.options.way && !($('.js-casted-powers-viewport .unit_movement_boost').get(0) || $(wndID + '.short_duration').get(0))) {
                                ShortDuration.add(wndID);
                            }
                            if (DATA.options.sen) {
                                SentUnits.add(wndID, action);
                            }
                            break;
                        case "rec_mark":
                            break;
                    }
                }
            }
        }
    }
    function WWTradeHandler() {
        var wndArray, wndID, wndA;
        wndArray = uw.GPWindowMgr.getOpen(uw.GPWindowMgr.TYPE_WONDERS);
        for (var e in wndArray) {
            if (wndArray.hasOwnProperty(e)) {
                wndID = "#gpwnd_" + wndArray[e].getID() + " ";
                if (DATA.options.per && !($(wndID + '.btn_trade').get(0) || $(wndID + '.next_building_phase').get(0) || $(wndID + '#ww_time_progressbar').get(0))) {
                    addPercentTrade(wndID, true);
                }
            }
        }
    }
    ///////////////////////////////////
   //       * Sent units box *      //
  ///////////////////////////////////
    var SentUnits = {
        activate: function() {
            $.Observer(GameEvents.command.send_unit).subscribe('JOE_SEND_UNITS', function(e, data) {
                for (var z in data.params) {
                    if (data.params.hasOwnProperty(z) && (data.sending_type !== "")) {
                        if (uw.GameData.units[z]) {
                            sentUnitsArray[data.sending_type][z] = (sentUnitsArray[data.sending_type][z] == undefined ? 0 : sentUnitsArray[data.sending_type][z]);
                            sentUnitsArray[data.sending_type][z] += data.params[z];
                        }
                    }
                }
            });
        },
        deactivate: function() {
            $.Observer(GameEvents.command.send_unit).unsubscribe('JOE_SEND_UNITS');
        },
        add: function(wndID, action) {
            if (!$(wndID + '.sent_units_box').get(0)) {
                $('<div class="game_inner_box sent_units_box ' + action + '"><div class="game_border ">' +
                    '<div class="game_border_top"></div><div class="game_border_bottom"></div><div class="game_border_left"></div><div class="game_border_right"></div>' +
                    '<div class="game_border_corner corner1"></div><div class="game_border_corner corner2"></div>' +
                    '<div class="game_border_corner corner3"></div><div class="game_border_corner corner4"></div>' +
                    '<div class="game_header bold">' +
                    '<div class="icon_sent townicon_' + (action == "attack" ? "lo" : "ld") + '"></div><span>' + getText("labels", "lab") + ' (' + (action == "attack" ? "OFF" : "DEF") + ')</span>' +
                    '</div>' +
                    '<div class="troops"><div class="units_list"></div><hr style="width: 172px;border: 1px solid rgb(185, 142, 93);margin: 3px 0px 2px -1px;">' +
                    '<div id="btn_sent_units_reset" class="button_new">' +
                    '<div class="left"></div>' +
                    '<div class="right"></div>' +
                    '<div class="caption js-caption">' + getText("buttons", "res") + '<div class="effect js-effect"></div></div>' +
                    '</div>' +
                    '</div></div>').appendTo(wndID + '.attack_support_window');
                SentUnits.update(action);
                $(wndID + '.icon_sent').css({
                    height: '20px',
                    marginTop: '-2px',
                    width: '20px',
                    backgroundPositionY: '-26px',
                    paddingLeft: '0px',
                    marginLeft: '0px'
                });
                $(wndID + '.sent_units_box').css({
                    position: 'revert',
                    right: '0px',
                    bottom: '296px',
                    width: '192px',
                    background: 'rgba(0, 0, 0, 0.6)',
                    border: '1px solid darkgreen'
                });
                $(wndID + '.troops').css({
                    padding: '6px 0px 6px 6px'
                });
                $(wndID + '#btn_sent_units_reset').click(function() {
                    sentUnitsArray[action] = {};
                    SentUnits.update(action);
                });
            }
        },
        update: function(action) {
            try {
                $('.sent_units_box.' + action + ' .units_list').each(function() {
                    this.innerHTML = "";
                });
                for (var x in sentUnitsArray[action]) {
                    if (sentUnitsArray[action].hasOwnProperty(x)) {
                        if ((sentUnitsArray[action][x] || 0) > 0) {
                            $('.sent_units_box.' + action + ' .units_list').each(function() {
                                $(this).append('<div class="unit_icon25x25 ' + x +
                                    (sentUnitsArray[action][x] >= 1000 ? (sentUnitsArray[action][x] >= 10000 ? " five_digit_number" : " four_digit_number") : "") + '">' +
                                    '<span class="count text_shadow">' + sentUnitsArray[action][x] + '</span>' +
                                    '</div>');
                            });
                        }
                    }
                }
                saveValue(WID + "_sentUnits", JSON.stringify(sentUnitsArray));
            } catch (error) {
                errorHandling(error, "updateSentUnitsBox");
            }
        }
    };
    ///////////////////////////////////
   //       * Short duration *      //
  ///////////////////////////////////
    var DurationCalculator = {
        activate: function() {
            var speedBoosterSprite = "https://i.imgur.com/hrUN5o6.png";
            $('<style id="joe_duration_calculator_style">' +
                '.joe_speed_booster { border:1px solid #724B08; border-spacing: 0px;} ' +
                '.joe_speed_booster td { border:0; padding:2px; } ' +
                '.joe_speed_booster .checkbox_new { margin: 4px 0px 1px 3px; } ' +
                '.joe_speed_booster .odd { background: url("https://gpall.innogamescdn.com/images/game/border/brown.png") repeat scroll 0% 0% transparent; } ' +
                '.joe_speed_booster .even { background: url("https://gpall.innogamescdn.com/images/game/border/odd.png") repeat scroll 0% 0% transparent; } ' +
                '.booster_icon { width:20px; height:20px; background-image:url(' + speedBoosterSprite + ');} ' +
                '.booster_icon.improved_speed { background-position:0 0; } ' +
                '.booster_icon.cartography { background-position:-20px 0; } ' +
                '.booster_icon.meteorology { background-position:-40px 0; } ' +
                '.booster_icon.lighthouse { background-position:-60px 0; } ' +
                '.booster_icon.set_sail { background-position:-80px 0; } ' +
                '.booster_icon.atalanta { background-position:-100px 0; } ' +
                '</style>').appendTo('head');
            $('<table class="joe_speed_booster"><tr>' +
                '<td class="odd"><div class="booster_icon improved_speed"></div><div class="checkbox_new checked"><div class="cbx_icon"></div></div></td>' +
                '<td class="even"><div class="booster_icon cartography"></div><div class="checkbox_new checked"><div class="cbx_icon"></div></div></td>' +
                '<td class="odd"><div class="booster_icon meteorology"></div><div class="checkbox_new checked"><div class="cbx_icon"></div></div></td>' +
                '<td class="even"><div class="booster_icon lighthouse"></div><div class="checkbox_new checked"><div class="cbx_icon"></div></div></td>' +
                '<td class="odd"><div class="booster_icon set_sail"></div><div class="checkbox_new checked"><div class="cbx_icon"></div></div></td>' +
                '<td class="even"><div class="booster_icon atalanta"></div><div class="checkbox_new checked"><div class="cbx_icon"></div></div></td>' +
                '</tr></table>').appendTo(wndID + ".duration_container");
        },
        deactivate: function() {
            $('#joe_duration_calculator_style').remove();
        },
        add: function(wndID, data) {

        }
    };
    var ShortDuration = {
        activate: function() {
            $('<style id="joe_short_duration_style">' +
                '.attack_support_window .tab_type_support .duration_container { top:0px !important; } ' +
                '.attack_support_window .joe_duration { border-spacing:0px; margin-bottom:2px; text-align:right; } ' +
                '.attack_support_window .way_duration, ' +
                '.attack_support_window .arrival_time { padding:0px 0px 0px 0px; background:none; } ' +
                '.attack_support_window .way_icon { padding:30px 0px 0px 30px; background:transparent url(https://gpall.innogamescdn.com/images/game/towninfo/traveltime.png) no-repeat 0 0; } ' +
                '.attack_support_window .arrival_icon { padding:30px 0px 0px 30px; background:transparent url(https://gpall.innogamescdn.com/images/game/towninfo/arrival.png) no-repeat 0 0; } ' +
                '.attack_support_window .short_icon { padding:20px 0px 0px 30px; background:url(https://i.imgur.com/SJLg8nm.png) 11px -1px / 21px no-repeat; filter: hue-rotate(50deg); -webkit-filter: hue-rotate(50deg); } ' +
                '.attack_support_window .hades_icon { padding:20px 0px 0px 30px; background:url(https://flasktools.altervista.org/images/hades_arrival.png) 11px -1px / 18px no-repeat; } ' +
                '.attack_support_window .max_booty { padding:0px 0px 0px 30px; margin:3px 4px 4px 4px; width:auto; } ' +
                '.attack_support_window .fight_bonus.morale { margin-top:2px; } ' +
                '.attack_support_window .fast_boats_needed { background:transparent url(https://i.imgur.com/vIhorz8.png) no-repeat 0 0; padding:2px 10px 7px 24px; margin:13px 0px -8px 13px; } ' +
                '.attack_support_window .slow_boats_needed { background:transparent url(https://i.imgur.com/xA95ftB.png) no-repeat 0 0; padding:2px 10px 7px 24px; margin:13px 0px -8px 13px; } ' +
                '</style>').appendTo('head');
        },
        deactivate: function() {
            $("#joe_short_duration_style").remove();
        },
        add: function(wndID) {
            try {
                var tooltip = (LANG.hasOwnProperty(MID) ? getText("labels", "improved_movement") : "") + " (+30% " + DM.getl10n("barracks", "tooltips").speed.trim() + ")";
                var tooltip_2 = (LANG.hasOwnProperty(MID) ? getText("labels", "cap_of_invisibility") : "");
                $('<table class="joe_duration">' +
                    '<tr><td class="way_icon"></td><td class="joe_way"></td><td class="arrival_icon"></td><td class="joe_arrival"></td><td colspan="2" class="joe_night"></td></tr>' +
                    '<tr class="short_duration_row" style="color:darkgreen">' +
                    '<td>&nbsp;╚&gt;&nbsp;</td><td><span class="short_duration">~0:00:00</span></td>' +
                    '<td>&nbsp;&nbsp;&nbsp;╚&gt;</td><td><span class="short_arrival">~00:00:00</span></td>' +
                    '<td class="short_icon"></td><td></td></tr>' +
                    '<tr class="hades_duration_row" style="color:darkred">' +
                    '<td>&nbsp;╚&gt;&nbsp;</td><td><span class="hades_duration">~0:00:00</span></td>' +
                    '<td>&nbsp;&nbsp;&nbsp;╚&gt;</td><td><span class="hades_visibility">~00:00:00</span></td>' +
                    '<td class="hades_icon"></td><td></td></tr>' +
                    '</table>').prependTo(wndID + ".duration_container");
                $(wndID + ".nightbonus").appendTo(wndID + ".joe_night");
                $(wndID + '.way_duration').appendTo(wndID + ".joe_way");
                $(wndID + ".arrival_time").appendTo(wndID + ".joe_arrival");
                $(wndID + '.short_duration_row').tooltip(tooltip);
                $(wndID + '.hades_duration_row').tooltip(tooltip_2);
                ShortDuration.change(wndID);
            } catch (error) {
                errorHandling(error, "addShortDuration");
            }
        },
        change: function(wndID) {
            var duration = new MutationObserver(function(mutations) {
                mutations.forEach(function(mutation) {
                    if (mutation.addedNodes[0]) {
                        //console.debug(mutation);
                        ShortDuration.calculate(wndID);
                    }
                });
            });
            if ($(wndID + '.way_duration').get(0)) {
                duration.observe($(wndID + '.way_duration').get(0), {
                    attributes: false,
                    childList: true,
                    characterData: false
                });
            }
        },
        calculate: function(wndID) {
            try {
                var setup_time = 900 / Game.game_speed,
                    duration_time = $(wndID + '.duration_container .way_duration').get(0).innerHTML.replace("~", "").split(":"),
                    duration_time_2,
                    duration_time_3,
                    arrival_time,
                    visibility_time,
                    h, m, s,
                    atalanta_factor = 0;
                var hasCartography = ITowns.getTown(Game.townId).getResearches().get("cartography");
                var hasMeteorology = ITowns.getTown(Game.townId).getResearches().get("meteorology");
                var hasSetSail = ITowns.getTown(Game.townId).getResearches().get("set_sail");
                var hasLighthouse = ITowns.getTown(Game.townId).buildings().get("lighthouse");
                if ($(wndID + '.unit_container.heroes_pickup .atalanta').get(0)) {
                    if ($(wndID + '.cbx_include_hero').hasClass("checked")) {
                        var atalanta_level = MM.getCollections().PlayerHero[0].getHero("atalanta").get("level");
                        atalanta_factor = (atalanta_level + 10) / 100;
                    }
                }
                duration_time = ((parseInt(duration_time[0], 10) * 60 + parseInt(duration_time[1], 10)) * 60 + parseInt(duration_time[2], 10));
                duration_time_2 = ((duration_time - setup_time) * (1 + atalanta_factor)) / (1 + 0.3 + atalanta_factor) + setup_time;
                duration_time_3 = (duration_time - setup_time) / 10;
                h = Math.floor(duration_time_2 / 3600);
                m = Math.floor((duration_time_2 - h * 3600) / 60);
                s = Math.floor(duration_time_2 - h * 3600 - m * 60);
                if (m < 10) {
                    m = "0" + m;
                }
                if (s < 10) {
                    s = "0" + s;
                }
                $(wndID + '.short_duration').get(0).innerHTML = "~" + h + ":" + m + ":" + s;
                h = Math.floor(duration_time_3 / 3600);
                m = Math.floor((duration_time_3 - h * 3600) / 60);
                s = Math.floor(duration_time_3 - h * 3600 - m * 60);
                if (m < 10) {
                    m = "0" + m;
                }
                if (s < 10) {
                    s = "0" + s;
                }
                $(wndID + '.hades_duration').get(0).innerHTML = "~" + h + ":" + m + ":" + s;
                arrival_time = Math.round((Timestamp.server() + Game.server_gmt_offset)) + duration_time_2;
                visibility_time = Math.round((Timestamp.server() + Game.server_gmt_offset)) + duration_time_3;
                h = Math.floor(arrival_time / 3600);
                m = Math.floor((arrival_time - h * 3600) / 60);
                s = Math.floor(arrival_time - h * 3600 - m * 60);
                h %= 24;
                if (m < 10) {
                    m = "0" + m;
                }
                if (s < 10) {
                    s = "0" + s;
                }
                $(wndID + '.short_arrival').get(0).innerHTML = "~" + h + ":" + m + ":" + s;
                clearInterval(arrival_interval[wndID]);
                arrival_interval[wndID] = setInterval(function() {
                    arrival_time += 1;
                    h = Math.floor(arrival_time / 3600);
                    m = Math.floor((arrival_time - h * 3600) / 60);
                    s = Math.floor(arrival_time - h * 3600 - m * 60);
                    h %= 24;
                    if (m < 10) {
                        m = "0" + m;
                    }
                    if (s < 10) {
                        s = "0" + s;
                    }
                    if ($(wndID + '.short_arrival').get(0)) {
                        $(wndID + '.short_arrival').get(0).innerHTML = "~" + h + ":" + m + ":" + s;
                    } else {
                        clearInterval(arrival_interval[wndID]);
                    }
                }, 1000);
                h = Math.floor(visibility_time / 3600);
                m = Math.floor((visibility_time - h * 3600) / 60);
                s = Math.floor(visibility_time - h * 3600 - m * 60);
                h %= 24;
                if (m < 10) {
                    m = "0" + m;
                }
                if (s < 10) {
                    s = "0" + s;
                }
                $(wndID + '.hades_visibility').get(0).innerHTML = "~" + h + ":" + m + ":" + s;
                clearInterval(hades_interval[wndID]);
                hades_interval[wndID] = setInterval(function() {
                    visibility_time += 1;
                    h = Math.floor(visibility_time / 3600);
                    m = Math.floor((visibility_time - h * 3600) / 60);
                    s = Math.floor(visibility_time - h * 3600 - m * 60);
                    h %= 24;
                    if (m < 10) {
                        m = "0" + m;
                    }
                    if (s < 10) {
                        s = "0" + s;
                    }
                    if ($(wndID + '.hades_visibility').get(0)) {
                        $(wndID + '.hades_visibility').get(0).innerHTML = "~" + h + ":" + m + ":" + s;
                    } else {
                        clearInterval(hades_interval[wndID]);
                    }
                }, 1000);

            } catch (error) {
                errorHandling(error, "ShortDuration.calculate");
            }
        }
    };
    ///////////////////////////////////
   //        * Dropdown menu *      //
  ///////////////////////////////////
    var drop_over = new Image();
    drop_over.src = "https://i.imgur.com/QdsDVxg.png";
    var drop_out = new Image();
    drop_out.src = "https://i.imgur.com/sbOAuiJ.png";
    function changeDropDownButton() {
        $('<style id="joe_style_arrow" type="text/css">' +
            '#dd_filter_type .arrow, .select_rec_unit .arrow {' +
            'width: 18px !important; height: 17px !important; background: url("https://i.imgur.com/sbOAuiJ.png") no-repeat 0px -1px !important;' +
            'position: absolute; top: 2px !important; right: 3px; } ' +
            '</style>').appendTo('head');
    }
    ///////////////////////////////////
   //      * Recruiting Trade *     //
  ///////////////////////////////////
    var trade_count = 0,
        unit = "FS",
        percent = "0.0";
    var RecruitingTrade = {
        activate: function() {
            $('<style id="joe_style_recruiting_trade" type="text/css">' +
                '#joe_recruiting_trade .option_s { filter:grayscale(85%); -webkit-filter:grayscale(85%); margin:0px; cursor:pointer; } ' +
                '#joe_recruiting_trade .option_s:hover { filter:unset !important; -webkit-filter:unset !important; } ' +
                '#joe_recruiting_trade .select_rec_unit .sel { filter:sepia(100%); -webkit-filter:sepia(100%); } ' +
                '#joe_recruiting_trade .option {color:#000; background:#FFEEC7; } ' +
                '#joe_recruiting_trade .option:hover {color:#fff; background:#328BF1; } ' +
                '#joe_recruiting_trade { position:absolute; left:30px; top:70px; } ' +
                '#joe_recruiting_trade .select_rec_unit { position:absolute; top:20px; width:147px; display:none; left:-31px; } ' +
                '#joe_recruiting_trade .select_rec_perc { position:absolute; top:20px; width:50px; display:none; left:50px; } ' +
                '#joe_recruiting_trade .open { display:block !important; } ' +
                '#joe_recruiting_trade .item-list { max-height:237px; } ' +
                '#joe_recruiting_trade .arrow { width:18px; height:18px; background:url(' + drop_out.src + ') no-repeat -1px -1px; position:absolute; } ' +
                '#trade_tab .content { height:320px;  } ' +
                '#joe_recruiting_trade .drop_rec_unit { position:absolute; display:block; width:50px; overflow:visible; z-index: 200px; } ' +
                '#joe_recruiting_trade .drop_rec_perc { position:absolute; display:block; width:55px; left:49px; color:#000; } ' +
                '</style>').appendTo('head');
        },
        deactivate: function() {
            $('#joe_style_recruiting_trade').remove();
            $('#joe_recruiting_trade').remove();
        },
        add: function(wndID) {
            var max_amount;
            $('<div id="joe_recruiting_trade" class="rec_trade">' +
                '<div class="drop_rec_unit dropdown default">' +
                '<div class="border-left"></div>' +
                '<div class="border-right"></div>' +
                '<div class="caption" name="' + unit + '">' + unit + '</div>' +
                '<div class="arrow"></div>' +
                '</div>' +
                '<div class="drop_rec_perc dropdown default">' +
                '<div class="border-left"></div>' +
                '<div class="border-right"></div>' +
                '<div class="caption" name="' + percent + '">' + Math.round(percent * 100) + '%</div>' +
                '<div class="arrow"></div>' +
                '</div><span class="rec_count">(' + trade_count + ')</span></div>').appendTo(wndID + ".content"); //<span class="rec_count">(' + trade_count + ')</span></div>
            $(".joe_cultureB").css({
                "cursor": "pointer",
                "width": "25px",
                "height": "27px",
                "float": "right",
                "position": "relative",
                "margin-left": "3px",
                "border": "2px groove gray",
                "background": "url(https://gpfr.innogamescdn.com/images/game/overviews/celebration_bg_new.png)"
            });
            $('<div id="joe_Select_boxes" class="select_rec_unit dropdown-list default active">' +
                '<div class="item-list">' +
                '<div id="joeattack_ship" class="option_s unit index_unit unit_icon40x40 attack_ship" name="FS"></div>' +
                '<div id="joebireme" class="option_s unit index_unit unit_icon40x40 bireme" name="BI"></div>' +
                '<div id="joetrireme" class="option_s unit index_unit unit_icon40x40 trireme" name="TR"></div>' +
                '<div id="joetransporter" class="option_s unit index_unit unit_icon40x40 big_transporter" name="BT"></div>' +
                '<div id="joesmall_trans" class="option_s unit index_unit unit_icon40x40 small_transporter" name="BE"></div>' +
                '<div id="joesmall_colonize" class="option_s unit index_unit unit_icon40x40 colonize_ship" name="CE"></div>' +
                '<div id="joesword" class="option_s unit index_unit unit_icon40x40 sword" name="SK"></div>' +
                '<div id="joeslinger" class="option_s unit index_unit unit_icon40x40 slinger" name="SL"></div>' +
                '<div id="joearcher" class="option_s unit index_unit unit_icon40x40 archer" name="BS"></div>' +
                '<div id="joehoplite" class="option_s unit index_unit unit_icon40x40 hoplite" name="HO"></div>' +
                '<div id="joerider" class="option_s unit index_unit unit_icon40x40 rider" name="RE"></div>' +
                '<div id="joechariot" class="option_s unit index_unit unit_icon40x40 chariot" name="SW"></div>' +
                '<div id="joecentaur" class="option_s unit index_unit unit_icon40x40 centaur" name="CT"></div>' +
                '<div id="joecerberus" class="option_s unit index_unit unit_icon40x40 cerberus" name="CB"></div>' +
                '<div id="joezyklop" class="option_s unit index_unit unit_icon40x40 zyklop" name="CL"></div>' +
                '<div id="joefury" class="option_s unit index_unit unit_icon40x40 fury" name="EY"></div>' +
                '<div id="joemedusa" class="option_s unit index_unit unit_icon40x40 medusa" name="MD"></div>' +
                '<div id="joeminotaur" class="option_s unit index_unit unit_icon40x40 minotaur" name="MT"></div>' +
                '<div id="joesea_monster" class="option_s unit index_unit unit_icon40x40 sea_monster" name="HD"></div>' +
                '<div id="joeharpy" class="option_s unit index_unit unit_icon40x40 harpy" name="HP"></div>' +
                '<div id="joemanticore" class="option_s unit index_unit unit_icon40x40 manticore" name="MN"></div>' +
                '<div id="joepegasus" class="option_s unit index_unit unit_icon40x40 pegasus" name="PG"></div>' +
                '<div id="joegriffin" class="option_s unit index_unit unit_icon40x40 griffin" name="GF"></div>' +
                ((Game.gods_active.aphrodite) ? (
                    '<div id="joesiren" class="option_s unit index_unit unit_icon40x40 siren" name="SE"></div>' +
                    '<div id="joesatyr" class="option_s unit index_unit unit_icon40x40 satyr" name="ST"></div>') : "") +
                ((Game.gods_active.ares) ? (
                    '<div id="joeladon" class="option_s unit index_unit unit_icon40x40 ladon" name="LD"></div>' +
                    '<div id="joespartoi" class="option_s unit index_unit unit_icon40x40 spartoi" name="SR"></div>') : "") +
                '<div id="joewall" class="option_s unit index_unit place_image wall_level" name="WA"></div>' +
                '<div id="joefestivals" class="option_s unit index_unit place_image morale" name="FE"></div>' +
                '</div></div>').appendTo(wndID + ".rec_trade");
            $('<div class="select_rec_perc dropdown-list default inactive">' +
                '<div class="item-list">' +
                '<div class="option sel" name="0.0">&nbsp;&nbsp;0%</div>' +
                '<div class="option" name="0.05">&nbsp;&nbsp;5%</div>' +
                '<div class="option" name="0.07">&nbsp;&nbsp;7%</div>' +
                '<div class="option" name="0.1">10%</div>' +
                '<div class="option" name="0.14">14%</div>' +
                '<div class="option" name="0.16666">17%</div>' +
                '<div class="option" name="0.2">20%</div>' +
                '<div class="option" name="0.25">25%</div>' +
                '<div class="option" name="0.33">33%</div>' +
                '<div class="option" name="0.5">50%</div>' +
                '</div></div>').appendTo(wndID + ".rec_trade");
            $(wndID + ".rec_trade [name='" + unit + "']").toggleClass("sel");
            $(wndID + ' .select_rec_unit .option_s').each(function() {
                $(this).click(function(e) {
                    $(".select_rec_unit .sel").toggleClass("sel");
                    $("." + this.className.split(" ")[4]).toggleClass("sel");
                    unit = $(this).attr("name");
                    $('.drop_rec_unit .caption').attr("name", unit);
                    $('.drop_rec_unit .caption').each(function() {
                        this.innerHTML = unit;
                    });
                    $($(this).parent().parent().get(0)).removeClass("open");
                    $('.drop_rec_unit .caption').change();
                });
            });
            $(wndID + ' .select_rec_perc .option').each(function() {
                $(this).click(function(e) {
                    $(this).parent().find(".sel").toggleClass("sel");
                    $(this).toggleClass("sel");
                    percent = $(this).attr("name");
                    $('.drop_rec_perc .caption').attr("name", percent);
                    $('.drop_rec_perc .caption').each(function() {
                        this.innerHTML = Math.round(percent * 100) + "%";
                    });
                    $($(this).parent().parent().get(0)).removeClass("open")
                    $('.drop_rec_perc .caption').change();
                });
            });
            $(wndID + '.drop_rec_perc').click(function(e) {
                if (!$($(e.target)[0].parentNode.parentNode.childNodes[4]).hasClass("open")) {
                    $($(e.target)[0].parentNode.parentNode.childNodes[4]).addClass("open");
                    $($(e.target)[0].parentNode.parentNode.childNodes[3]).removeClass("open");
                } else {
                    $($(e.target)[0].parentNode.parentNode.childNodes[4]).removeClass("open");
                }
            });
            $(wndID + '.drop_rec_unit').click(function(e) {
                if (!$($(e.target)[0].parentNode.parentNode.childNodes[3]).hasClass("open")) {
                    $($(e.target)[0].parentNode.parentNode.childNodes[3]).addClass("open");
                    $($(e.target)[0].parentNode.parentNode.childNodes[4]).removeClass("open");
                } else {
                    $($(e.target)[0].parentNode.parentNode.childNodes[3]).removeClass("open");
                }
            });
            $(wndID).click(function(e) {
                var clicked = $(e.target),
                    element = $('#' + this.id + ' .dropdown-list.open').get(0);
                if ((clicked[0].parentNode.className.split(" ")[1] !== "dropdown") && element) {
                    $(element).removeClass("open");
                }
            });
            $(wndID + '.dropdown').hover(function(e) {
                $(e.target)[0].parentNode.childNodes[3].style.background = "url('" + drop_over.src + "') no-repeat -1px -1px";
            }, function(e) {
                $(e.target)[0].parentNode.childNodes[3].style.background = "url('" + drop_out.src + "') no-repeat -1px -1px";
            });
            $(wndID + ".drop_rec_unit .caption").attr("name", unit);
            $(wndID + ".drop_rec_perc .caption").attr("name", percent);
            $(wndID + '.drop_rec_unit').tooltip(joe_icon + getText("labels", "rat"));
            $(wndID + '.drop_rec_perc').tooltip(joe_icon + getText("labels", "shr"));
            var ratio = {
                NO: {
                    w: 0,
                    s: 0,
                    i: 0
                },
                FS: {
                    w: 1,
                    s: 0.2308,
                    i: 0.6154
                },
                BI: {
                    w: 1,
                    s: 0.8750,
                    i: 0.2250
                },
                SL: {
                    w: 0.55,
                    s: 1,
                    i: 0.4
                },
                RE: {
                    w: 0.6666,
                    s: 0.3333,
                    i: 1
                },
                SK: {
                    w: 1,
                    s: 0,
                    i: 0.8947
                },
                HO: {
                    w: 0,
                    s: 0.5,
                    i: 1
                },
                BS: {
                    w: 1,
                    s: 0,
                    i: 0.6250
                },
                SW: {
                    w: 0.4545,
                    s: 1,
                    i: 0.7273
                },
                TR: {
                    w: 1,
                    s: 0.65,
                    i: 0.65
                },
                BT: {
                    w: 1,
                    s: 1,
                    i: 0.8
                },
                BE: {
                    w: 1,
                    s: 0,
                    i: 0.5
                },
                WA: {
                    w: 0.10,
                    s: 1,
                    i: 0.726
                },
                FE: {
                    w: 0.8334,
                    s: 1,
                    i: 0.8334
                },
                CT: {
                    w: 1,
                    s: 0.1739,
                    i: 0.3913
                },
                CB: {
                    w: 0.4149,
                    s: 0.5,
                    i: 1
                },
                CL: {
                    w: 0.6,
                    s: 1,
                    i: 0.8
                },
                EY: {
                    w: 0.5,
                    s: 1,
                    i: 1
                },
                MD: {
                    w: 0.4074,
                    s: 1,
                    i: 0.5926
                },
                MT: {
                    w: 0.4587,
                    s: 0.1926,
                    i: 1
                },
                HD: {
                    w: 1,
                    s: 0.5185,
                    i: 0.7037
                },
                HP: {
                    w: 1,
                    s: 0.25,
                    i: 0.85
                },
                MN: {
                    w: 1,
                    s: 0.6818,
                    i: 0.7727
                },
                PG: {
                    w: 1,
                    s: 0.325,
                    i: 0.175
                },
                GF: {
                    w: 0.7884,
                    s: 0.4038,
                    i: 1
                },
                SR: {
                    w: 0.9756,
                    s: 0.9512,
                    i: 1
                },
                ST: {
                    w: 0.5577,
                    s: 0.2884,
                    i: 1
                },
                LD: {
                    w: 0.9767,
                    s: 1,
                    i: 0.9534
                },
                SE: {
                    w: 0.7727,
                    s: 0.5909,
                    i: 1
                }
            };
            if ($('#town_capacity_wood .max').get(0)) {
                max_amount = parseInt($('#town_capacity_wood .max').get(0).innerHTML, 10);
            } else {
                max_amount = 25500;
            }
            $(wndID + '.caption').change(function(e) {
                if (!(($(this).attr('name') === unit) || ($(this).attr('name') === percent))) {
                    $('.rec_count').get(0).innerHTML = "(" + trade_count + ")";
                }
                var tmp = $(this).attr('name');
                if ($(this).parent().attr('class').split(" ")[0] === "drop_rec_unit") {
                    unit = tmp;
                } else {
                    percent = tmp;
                }
                var max = (max_amount - 100) / 1000;
                addTradeMarks(max * ratio[unit].w, max * ratio[unit].s, max * ratio[unit].i, "lime");
                var part = (max_amount - 1000) * parseFloat(percent); // -1000 als Puffer (sonst Überlauf wegen Restressies, die nicht eingesetzt werden können, vorallem bei FS und Biremen)
                var rArray = uw.ITowns.getTown(uw.Game.townId).getCurrentResources();
                var tradeCapacity = uw.ITowns.getTown(uw.Game.townId).getAvailableTradeCapacity();
                var wood = ratio[unit].w * part;
                var stone = ratio[unit].s * part;
                var iron = ratio[unit].i * part;
                if ((wood > rArray.wood) || (stone > rArray.stone) || (iron > rArray.iron) || ((wood + stone + iron) > tradeCapacity)) {
                    wood = stone = iron = 0;
                    $('.drop_rec_perc .caption').css({
                        color: '#f00'
                    });
                } else {
                    $('.' + e.target.parentNode.parentNode.className + ' .drop_rec_perc .caption').css({
                        color: '#000'
                    });
                }
                $("#trade_type_wood [type='text']").select().val(wood).blur();
                $("#trade_type_stone [type='text']").select().val(stone).blur();
                $("#trade_type_iron [type='text']").select().val(iron).blur();
            });
            $('#trade_button').click(function() {
                trade_count++;
                $('.rec_count').get(0).innerHTML = "(" + trade_count + ")";
            });
            $(wndID + '.drop_rec_perc .caption').change();
            var units = uw.GameData.units;
            $('#joeattack_ship').tooltip(units.attack_ship.name);
            $('#joebireme').tooltip(units.bireme.name);
            $('#joetrireme').tooltip(units.trireme.name);
            $('#joetransporter').tooltip(units.big_transporter.name);
            $('#joesmall_trans').tooltip(units.small_transporter.name);
            $('#joesword').tooltip(units.sword.name);
            $('#joeslinger').tooltip(units.slinger.name);
            $('#joearcher').tooltip(units.archer.name);
            $('#joehoplite').tooltip(units.hoplite.name);
            $('#joerider').tooltip(units.rider.name);
            $('#joechariot').tooltip(units.chariot.name);
            $('#joewall').tooltip(GameData.buildings.wall.name);
            $('#joefestivals').tooltip(getText("Quack", "cityfestivals"));
            $('#joecentaur').tooltip(units.centaur.name);
            $('#joecerberus').tooltip(units.cerberus.name);
            $('#joezyklop').tooltip(units.zyklop.name);
            $('#joefury').tooltip(units.fury.name);
            $('#joemedusa').tooltip(units.medusa.name);
            $('#joeminotaur').tooltip(units.minotaur.name);
            $('#joesea_monster').tooltip(units.sea_monster.name);
            $('#joeharpy').tooltip(units.harpy.name);
            $('#joemanticore').tooltip(units.manticore.name);
            $('#joepegasus').tooltip(units.pegasus.name);
            $('#joegriffin').tooltip(units.griffin.name);
            $('#joespartoi').tooltip(units.spartoi.name);
            $('#joesatyr').tooltip(units.satyr.name);
            $('#joeladon').tooltip(units.ladon.name);
            $('#joesiren').tooltip(units.siren.name);
        }
    };
    ///////////////////////////////////
   //      * Ressources marks *     //
  ///////////////////////////////////
    function addTradeMarks(woodmark, stonemark, ironmark, color) {
        var max_amount, limit, wndArray = uw.GPWindowMgr.getOpen(uw.Layout.wnd.TYPE_TOWN),
            wndID;
        for (var e in wndArray) {
            if (wndArray.hasOwnProperty(e)) {
                wndID = "#gpwnd_" + wndArray[e].getID() + " ";
                if ($(wndID + '.town-capacity-indicator').get(0)) {
                    max_amount = $(wndID + '.amounts .max').get(0).innerHTML;
                    $('#trade_tab .c_' + color).each(function() {
                        this.remove();
                    });
                    $('#trade_tab .progress').each(function() {
                        if ($("p", this).length < 3) {
                            if ($(this).parent().get(0).id != "big_progressbar") {
                                limit = 1000 * (242 / parseInt(max_amount, 10));
                                switch ($(this).parent().get(0).id.split("_")[2]) {
                                    case "wood":
                                        limit = limit * woodmark;
                                        break;
                                    case "stone":
                                        limit = limit * stonemark;
                                        break;
                                    case "iron":
                                        limit = limit * ironmark;
                                        break;
                                }
                                $('<p class="c_' + color + '"style="position:absolute;left: ' + limit + 'px; background:' + color + ';width:2px;height:100%;margin:0px"></p>').appendTo(this);
                            }
                        }
                    });
                }
            }
        }
    }
    ///////////////////////////////////
   //      * Percentual Trade *     //
  ///////////////////////////////////
    var rest_count = 0;
    function addPercentTrade(wndID, ww) {
        var a = "";
        var content = wndID + ".content";
        if (ww) {
            a = "ww_";
            content = wndID + '.trade .send_res';
        }
        $('<div class="btn btn_trade"><a class="button" href="#">' +
            '<span class="left"><span class="right">' +
            '<span class="middle mid">' +
            '<span class="img_trade"></span></span></span></span>' +
            '<span style="clear:both;"></span>' +
            '</a></div>').prependTo(content);
        $(wndID + '.btn_trade').tooltip(joe_icon + getText("labels", "per"));
        setPercentTrade(wndID, ww);
        $(wndID + '.btn').css({
            width: '20px',
            overflow: 'visible',
            position: 'absolute',
            display: 'block',
            marginLeft: '20px'
        });
        if (!ww) {
            $(wndID + '.content').css({
                height: '320px'
            });
        }
        if (ww) {
            $(wndID + '.btn_trade').css({
                left: '638px',
                top: '154px'
            });
        } else {
            $(wndID + '.btn_trade').css({
                left: '336px',
                top: '129px'
            });
        }
        $(wndID + '.mid').css({
            minWidth: '26px'
        });
        $(wndID + '.img_trade').css({
            width: '27px',
            height: '27px',
            top: '-3px',
            float: 'left',
            position: 'relative',
            background: 'url("https://i.imgur.com/LZxtzL8.png") no-repeat'
        });
    }
    var res = {};

    function setPercentTrade(wndID, ww) {
        var a = ww ? "ww_" : "",
            own_town = $(wndID + '.town_info').get(0) ? true : false;
        $(wndID + '.btn_trade').toggleClick(function() {
            res.wood = {};
            res.stone = {};
            res.iron = {};
            res.sum = {};
            res.sum.amount = 0;
            setAmount(true, a, wndID);
            for (var e in res) {
                if (res.hasOwnProperty(e) && e != "sum") {
                    res[e].rest = false;
                    res[e].amount = parseInt($('.ui_resources_bar .' + e + ' .amount').get(0).innerHTML, 10);
                    res.sum.amount += res[e].amount;
                }
            }
            res.wood.percent = 100 / res.sum.amount * res.wood.amount;
            res.stone.percent = 100 / res.sum.amount * res.stone.amount;
            res.iron.percent = 100 / res.sum.amount * res.iron.amount;
            res.sum.cur = parseInt($(wndID + '#' + a + 'big_progressbar .caption .curr').get(0).innerHTML, 10);
            res.wood.part = parseInt(res.sum.cur / 100 * res.wood.percent, 10);
            res.stone.part = parseInt(res.sum.cur / 100 * res.stone.percent, 10);
            res.iron.part = parseInt(res.sum.cur / 100 * res.iron.percent, 10);
            for (var f in res) {
                if (res.hasOwnProperty(f) && f != "sum") {
                    if (!ww && own_town) { // Own town
                        var curr = parseInt($(wndID + '#town_capacity_' + f + ' .amounts .curr').get(0).innerHTML.replace('+', '').trim(), 10) || 0,
                            curr2 = parseInt($(wndID + '#town_capacity_' + f + ' .amounts .curr2').get(0).innerHTML.replace('+', '').trim(), 10) || 0,
                            max = parseInt($(wndID + '#town_capacity_' + f + ' .amounts .max').get(0).innerHTML.replace('+', '').trim(), 10) || 0;
                        res[f].cur = curr + curr2;
                        res[f].max = max - res[f].cur;
                        if (res[f].max < 0) {
                            res[f].max = 0;
                        }
                    } else {
                        res[f].max = 30000;
                    }
                }
            }
            res.stone.part += res.sum.cur - (res.wood.part + res.stone.part + res.iron.part);
            res.sum.rest = 0;
            rest_count = 0;
            calcRestAmount();
            setAmount(false, a, wndID);
        }, function() {
            setAmount(true, a, wndID);
        });
    }
    function calcRestAmount() {
        if (res.sum.rest > 0) {
            for (var e in res) {
                if (res.hasOwnProperty(e) && e != "sum" && res[e].rest != true) {
                    res[e].part += res.sum.rest / (3 - rest_count);
                }
            }
            res.sum.rest = 0;
        }
        for (var f in res) {
            if (res.hasOwnProperty(f) && f != "sum" && res[f].rest != true) {
                if (res[f].max <= res[f].part) {
                    res[f].rest = true;
                    res.sum.rest += res[f].part - res[f].max;
                    rest_count += 1;
                    res[f].part = res[f].max;
                }
            }
        }
        if (res.sum.rest > 0 && rest_count < 3) {
            calcRestAmount();
        }
    }
    function setAmount(clear, a, wndID) {
        for (var e in res) {
            if (res.hasOwnProperty(e) && e != "sum") {
                if (clear == true) {
                    res[e].part = 0;
                }
                $(wndID + "#" + a + "trade_type_" + e + ' [type="text"]').select().val(res[e].part).blur();
            }
        }
    }
    //////////////////////////////////////////////////////////////////////////
   //    * Unit strength (sharp/blunt/distance) and Transport Capacity *   //
  //////////////////////////////////////////////////////////////////////////
    var def = true,
        blunt = 0,
        sharp = 0,
        dist = 0,
        shipsize = false;
    var UnitStrength = {
        calcDef: function(units) {
            var e;
            blunt = sharp = dist = 0;
            for (e in units) {
                if (units.hasOwnProperty(e)) {
                    blunt += units[e] * uw.GameData.units[e].def_hack;
                    sharp += units[e] * uw.GameData.units[e].def_pierce;
                    dist += units[e] * uw.GameData.units[e].def_distance;
                }
            }
        },
        calcOff: function(units, selectedUnits) {
            var e;
            blunt = sharp = dist = 0;
            for (e in selectedUnits) {
                if (selectedUnits.hasOwnProperty(e)) {
                    var attack = (units[e] || 0) * uw.GameData.units[e].attack;
                    switch (uw.GameData.units[e].attack_type) {
                        case 'hack':
                            blunt += attack;
                            break;
                        case 'pierce':
                            sharp += attack;
                            break;
                        case 'distance':
                            dist += attack;
                            break;
                    }
                }
            }
        },
    ///////////////////////////////////
   //  * Unit strength/Unit menu *  //
  ///////////////////////////////////
        Menu: {
            activate: function() {
                $('<div id="strength" class="cont def"><hr>' +
                    '<span class="bold text_shadow cont_left strength_font">' +
                    '<table style="margin:0px;">' +
                    '<tr><td><div class="ico units_info_sprite img_hack"></td><td id="blunt">0</td></tr>' +
                    '<tr><td><div class="ico units_info_sprite img_pierce"></td><td id="sharp">0</td></tr>' +
                    '<tr><td><div class="ico units_info_sprite img_dist"></td><td id="dist">0</td></tr>' +
                    '</table>' +
                    '</span>' +
                    '<div class="cont_right">' +
                    '<img id="def_button" class="active img" src="https://i.imgur.com/yCscoTy.png">' +
                    '<img id="off_button" class="img" src="https://i.imgur.com/tBCPYww.png">' +
                    '</div></div>' +
                    '<div id= "joe_tr_btn" class="">' + getText("options", "str")[0] + '</div>').appendTo('.units_land .content');
                $(".units_land .nav .border_top").click(function() {
                    BarracksWindowFactory.openBarracksWindow();
                });
                $("#joe_tr_btn").click(function() {
                    if ($("#strength").css('display') == 'none') {
                        UnitStrength.Menu.update();
                    }
                    $("#strength").slideToggle();
                });
                $("#joe_tr_btn").hover(
                    function() {
                        $("#joe_tr_btn").css({
                            "color": "#EEDDBB"
                        });
                    },
                    function() {
                        $("#joe_tr_btn").css({
                            "color": "#ECB44D"
                        });
                    });
                $("#strength").click(function() {
                    UnitStrength.Menu.update();
                });
                $("#joe_tr_btn").css({
                    "cursor": "pointer",
                    "height": "12px",
                    "width": "127px",
                    "font-size": "10px",
                    "font-weight": "bold",
                    "color": "#ECB44D",
                    "background": "url(https://gpall.innogamescdn.com/images/game/layout/progressbars-sprite_2.90_compressed.png) no-repeat 0 -100px"
                });
                $('<style id="joe_strength_style">' +
                    '#strength.def #off_button, #strength.off #def_button { filter:url(#Sepia); -webkit-filter:sepia(1); }' +
                    '#strength.off #off_button, #strength.def #def_button { filter:none; -webkit-filter:none; } ' +
                    '#strength.off .img_hack { background-position:0% 36%;} ' +
                    '#strength.def .img_hack { background-position:0%  0%;} ' +
                    '#strength.off .img_pierce { background-position:0% 27%;} ' +
                    '#strength.def .img_pierce { background-position:0%  9%;} ' +
                    '#strength.off .img_dist { background-position:0% 45%;} ' +
                    '#strength.def .img_dist { background-position:0% 18%;} ' +
                    '#strength .strength_font { font-size: 0.8em; } ' +
                    '#strength.off .strength_font { color:#edb;} ' +
                    '#strength.def .strength_font { color:#fc6;} ' +
                    '#strength .ico { height:20px; width:20px; } ' +
                    '#strength .units_info_sprite { background:url(https://gpall.innogamescdn.com/images/game/units/units_info_sprite2.51.png); background-size:100%; } ' +
                    '#strength .img_pierce { background-position:0px -20px; } ' +
                    '#strength .img_dist { background-position:0px -40px; } ' +
                    '#strength hr { margin:0px; background-color:#5F5242; height:2px; border:0px solid; } ' +
                    '#strength .cont_left { width:65%;  display:table-cell; } ' +
                    '#strength.cont { background:url(https://gpall.innogamescdn.com/images/game/layout/layout_units_nav_border.png); } ' +
                    '#strength .cont_right { width:30%; display:table-cell; vertical-align:middle; } ' +
                    '#strength .img { float:right; background:none; margin:2px 8px 2px 0px; } ' +
                    '</style>').appendTo("head");
                $('.units_land .units_wrapper, .btn_gods_spells .checked').click(function() {
                    setTimeout(function() {
                        UnitStrength.Menu.update();
                    }, 100);
                });
                $('#off_button').click(function() {
                    $('#strength').addClass('off').removeClass('def');
                    def = false;
                    UnitStrength.Menu.update();
                });
                $('#def_button').click(function() {
                    $('#strength').addClass('def').removeClass('off');
                    def = true;
                    UnitStrength.Menu.update();
                });
                $('#def_button, #off_button').hover(function() {
                    $(this).css('cursor', 'pointer');
                });
                UnitStrength.Menu.update();
            },
            deactivate: function() {
                $('#strength').remove();
                $('#joe_strength_style').remove();
                $('#joe_tr_btn').remove();
            },
            update: function() {
                var unitsIn = uw.ITowns.getTown(uw.Game.townId).units(),
                    units = UnitStrength.Menu.getSelected();
                if (def === true) {
                    UnitStrength.calcDef(units);
                } else {
                    UnitStrength.calcOff(unitsIn, units);
                }
                $('#blunt').get(0).innerHTML = blunt;
                $('#sharp').get(0).innerHTML = sharp;
                $('#dist').get(0).innerHTML = dist;
            },
            getSelected: function() {
                var units = [];
                if ($(".units_land .units_wrapper .selected").length > 0) {
                    $(".units_land .units_wrapper .selected").each(function() {
                        units[this.className.split(" ")[1]] = this.children[0].innerHTML;
                    });
                } else {
                    $(".units_land .units_wrapper .unit").each(function() {
                        units[this.className.split(" ")[1]] = this.children[0].innerHTML;
                    });
                }
                return units;
            }
        },
    ///////////////////////////////////
   //  * Unit strength/ Conquest *  //
  ///////////////////////////////////
        Conquest: {
            add: function() {
                var units = [],
                    str;
                $('#conqueror_units_in_town .unit').each(function() {
                    str = $(this).attr("class").split(" ")[4];
                    if (!uw.GameData.units[str].is_naval) {
                        units[str] = parseInt(this.children[0].innerHTML, 10);
                    }
                });
                UnitStrength.calcDef(units);
                $('<div id="strength_eo" class="game_border" style="width:90px; margin: 20px; align:center;">' +
                    '<div class="game_border_top"></div><div class="game_border_bottom"></div>' +
                    '<div class="game_border_left"></div><div class="game_border_right"></div>' +
                    '<div class="game_border_corner corner1"></div><div class="game_border_corner corner2"></div>' +
                    '<div class="game_border_corner corner3"></div><div class="game_border_corner corner4"></div>' +
                    '<span class="bold" style="color:#000;font-size: 0.8em;"><table style="margin:0px;background:#f7dca2;width:100%;align:center;">' +
                    '<tr><td width="1%"><div class="ico units_info_sprite img_hack"></div></td><td id="bl" align="center" width="100%">0</td></tr>' +
                    '<tr><td><div class="ico units_info_sprite img_pierce"></div></td><td id="sh" align="center">0</td></tr>' +
                    '<tr><td><div class="ico units_info_sprite img_dist"></div></td><td id="di" align="center">0</td></tr>' +
                    '</table></span>' +
                    '</div>').appendTo('#conqueror_units_in_town');
                $('#strength_eo').tooltip('Gesamteinheitenstärke der Belagerungstruppen');
                $('#conqueror_units_in_town .publish_conquest_public_id_wrap').css({
                    marginLeft: '130px'
                });
                $('#strength_eo .ico').css({
                    height: '20px',
                    width: '20px'
                });
                $('#strength_eo .units_info_sprite').css({
                    background: 'url(https://gpall.innogamescdn.com/images/game/units/units_info_sprite2.51.png)',
                    backgroundSize: '100%'
                });
                $('#strength_eo .img_pierce').css({
                    backgroundPosition: '0% 9%'
                });
                $('#strength_eo .img_dist').css({
                    backgroundPosition: '0% 18%'
                });
                $('#bl').get(0).innerHTML = blunt;
                $('#sh').get(0).innerHTML = sharp;
                $('#di').get(0).innerHTML = dist;
            }
        },
    ///////////////////////////////////
   //  * Unit strength/ Barracks *  //
  ///////////////////////////////////
        Barracks: {
            add: function() {
                if (!$('#strength_baracks').get(0)) {
                    var units = [],
                        pop = 0;
                    $('#units .unit_order_total').each(function() {
                        units[$(this).parent().parent().attr("id")] = this.innerHTML;
                    });
                    UnitStrength.calcDef(units);
                    for (var e in units) {
                        if (units.hasOwnProperty(e)) {
                            pop += units[e] * uw.GameData.units[e].population;
                        }
                    }
                    $('<div id="strength_baracks" class="game_border" style="float:right; width:70px; align:center;">' +
                        '<div class="game_border_top"></div><div class="game_border_bottom"></div>' +
                        '<div class="game_border_left"></div><div class="game_border_right"></div>' +
                        '<div class="game_border_corner corner1"></div><div class="game_border_corner corner2"></div>' +
                        '<div class="game_border_corner corner3"></div><div class="game_border_corner corner4"></div>' +
                        '<span class="bold" style="color:#000;font-size: 0.8em;"><table style="margin:0px;background:#f7dca2;width:100%;align:center;">' +
                        '<tr><td width="1%"><div class="ico units_info_sprite img_hack"></div></td><td id="b" align="center" width="100%">0</td></tr>' +
                        '<tr><td><div class="ico units_info_sprite img_pierce"></div></td><td id="s" align="center">0</td></tr>' +
                        '<tr><td><div class="ico units_info_sprite img_dist"></div></td><td id="d" align="center">0</td></tr>' +
                        '</table></span>' +
                        '</div>').appendTo('.ui-dialog #units');
                    $('<div id="pop_baracks" class="game_border" style="float:right; width:60px; align:center;">' +
                        '<div class="game_border_top"></div><div class="game_border_bottom"></div>' +
                        '<div class="game_border_left"></div><div class="game_border_right"></div>' +
                        '<div class="game_border_corner corner1"></div><div class="game_border_corner corner2"></div>' +
                        '<div class="game_border_corner corner3"></div><div class="game_border_corner corner4"></div>' +
                        '<span class="bold" style="color:#000;font-size: 0.8em;"><table style="margin:0px;background:#f7dca2;width:100%;align:center;">' +
                        '<tr><td width="1%"><img class="ico" src="https://gpall.innogamescdn.com/images/game/res/pop.png"></td><td id="p" align="center" width="100%">0</td></tr>' +
                        '</table></span>' +
                        '</div>').appendTo('.ui-dialog #units');
                    $('.ui-dialog #units .ico').css({
                        height: '20px',
                        width: '20px'
                    });
                    $('.ui-dialog #units .units_info_sprite').css({
                        background: 'url(https://gpall.innogamescdn.com/images/game/units/units_info_sprite2.51.png)',
                        backgroundSize: '100%'
                    });
                    $('.ui-dialog #units .img_pierce').css({
                        backgroundPosition: '0% 9%'
                    });
                    $('.ui-dialog #units .img_dist').css({
                        backgroundPosition: '0% 18%'
                    });
                    $('#b').get(0).innerHTML = blunt;
                    $('#s').get(0).innerHTML = sharp;
                    $('#d').get(0).innerHTML = dist;
                    $('#p').get(0).innerHTML = pop;

                }
            }
        }
    };
    ///////////////////////////////////
   //    * Transporter capacity *   //
  ///////////////////////////////////
    var TransportCapacity = {
        activate: function() {
            $('<div id="transporter" class="cont" style="height:25px;">' +
                '<table style=" margin:0px;"><tr align="center" >' +
                '<td><img id="ship_pop" class="ico" src="https://gpall.innogamescdn.com/images/game/res/pop.png" width="21px" height="Auto"></td>' +
                '<td><span id="ship" class="bold text_shadow" style="color:#FFCC66;font-size: 10px;line-height: 2.1;"></span></td>' +
                '<td><img id="ship_img" class="ico" src="https://i.imgur.com/vIhorz8.png"></td>' +
                '</tr></table>' +
                '</div>').appendTo('.units_naval .content');
            $(".joe_tr_recruit").css({
                "background": "url(https://gpall.innogamescdn.com/images/game/units/units_info_sprite2.51.png)",
                "background-size": "100%",
                "width": "18px",
                "height": "18px",
                "float": "left"
            });
            $('#transporter.cont').css({
                background: 'url(https://gpall.innogamescdn.com/images/game/layout/layout_units_nav_border.png)'
            });
            $('#transporter').hover(function() {
                $(this).css('cursor', 'pointer');
            });
            $('#transporter').toggleClick(
                function() {
                    $('#ship_img').get(0).src = "https://i.imgur.com/xA95ftB.png";
                    shipsize = !shipsize;
                    TransportCapacity.update();
                },
                function() {
                    $('#ship_img').get(0).src = "https://i.imgur.com/vIhorz8.png";
                    shipsize = !shipsize;
                    TransportCapacity.update();
                }
            );
            TransportCapacity.update();
            $('#joe_tr_recruit').tooltip(joe_icon + getText("transport_calc", "recruits"));
            $('#joe_transporter').tooltip(joe_icon + DM.getl10n("barracks").tooltips.ship_transport.title);
        },
        deactivate: function() {
            $('#transporter').remove();
            $('#joe_transporter').remove();
            $('#joe_Port').remove();
            $('#joe_tr_recruit').remove();
        },
        update: function() {
            var selected_town = uw.ITowns.getTown(Game.townId);
            var GD_units = uw.GameData.units;
            var GD_heroes = uw.GameData.heroes;
            var bigTransp = 0,
                smallTransp = 0,
                pop = 0,
                ship = 0,
                unit, berth, units = [];
            smallTransp = parseInt(uw.ITowns.getTown(parseInt(uw.Game.townId, 10)).units().small_transporter, 10);
            if (isNaN(smallTransp)) smallTransp = 0;
            if (shipsize) {
                bigTransp = parseInt(uw.ITowns.getTown(parseInt(uw.Game.townId, 10)).units().big_transporter, 10);
                if (isNaN(bigTransp)) bigTransp = 0;
            }
            berth = 0;
            if (uw.ITowns.getTown(uw.Game.townId).researches().hasBerth()) {
                berth = GameData.research_bonus.berth;
            }
            ship = bigTransp * (GD_units.big_transporter.capacity + berth) + smallTransp * (GD_units.small_transporter.capacity + berth);

            units = uw.ITowns.getTown(uw.Game.townId).units();
            for (var e in units) {
                if (units.hasOwnProperty(e)) {
                    if (GD_units[e]) {
                        if (!(GD_units[e].is_naval || GD_units[e].flying)) {
                            pop += units[e] * GD_units[e].population;
                        }
                    }
                }
            };
            if ($(".joe_tr_recruit").parent().hasClass("checked")) {
                var recruits = selected_town.getUnitOrdersCollection().models;
                for (var i = 0; i < recruits.length; ++i) {
                    var unitt = recruits[i].attributes.unit_type;
                    var number = recruits[i].attributes.units_left;
                    var number2 = (unitt == "small_transporter") ? number : "";
                    if (!(unitt in GD_heroes) && units[unitt] != 0 && !GD_units[unitt].flying && GD_units[unitt].capacity == undefined) {
                        pop += number * GD_units[unitt].population;
                    } else if (!(unitt in GD_heroes) && units[unitt] != 0 && !GD_units[unitt].flying && GD_units[unitt].capacity != 0) {
                        if (!shipsize) {
                            ship += (number2 * (GD_units[unitt].capacity + berth));
                        }
                        if (shipsize) {
                            ship += (number * (GD_units[unitt].capacity + berth));
                        }
                    }
                }
            };
            $('#ship').get(0).innerHTML = pop + "/" + ship;
        }
    };
    ///////////////////////////////////
   //        * Simulator *          //
  ///////////////////////////////////
    var Simulator = {
        activate: function() {
            $('<style id="joe_simulator_style" type="text/css">' +
                '#place_simulator { overflow: hidden !important} ' +
                '#place_simulator .game_body { height: 417px !important} ' +
                '#place_simulator_form h4 { display:none; } ' +
                '#place_simulator .place_simulator_table { margin: 0px !important } ' +
                '#place_simulator_form .place_sim_wrap_mods { margin-bottom: 2px; } ' +
                '.place_sim_bonuses_heroes { position:absolute; right:3px; top:27px; width: 272px;} ' +
                '.place_sim_bonuses_heroes .place_sim_showhide { display:none; } ' +
                '.place_sim_wrap_mods .place_simulator_table :eq(1) { width: 300px;} ' +
                '.place_sim_wrap_mods > .place_simulator_table { width: 272px;} ' +
                '.place_sim_wrap_mods tr:last-child { display:none; } ' +
                '.place_sim_wrap_mods_extended { display: table-cell !important; -webkit-animation:MODBOX 1s; animation:MODBOX 1s; position: relative; width:272px; opacity: 1 !important; left: 0px; top: 0px} ' +
                '.place_sim_wrap_mods_extended table tr td:eq(0) { width: 18px !important } ' +
                '.place_sim_wrap_mods_extended td { border:0px; } ' +
                '.place_sim_wrap_mods_extended tr td:first-child { border-left:0px; width:19px; padding-left:0px; } ' +
                '.place_sim_wrap_mods_extended .place_simulator_table { margin:0px; border-collapse:separate; border:1px solid #724B08; table-layout:fixed; width:100% } ' +
                '.place_simulator_table .place_image { display:block; width: 20px; height:20px; background-size:100%; margin:auto; } ' +
                '.place_simulator_table .place_image.pa_commander { background: url(https://i.imgur.com/Po2CtN7.jpg); background-position: -22px -44px; } ' +
                '.place_simulator_table .place_image.pa_captain { background: url(https://i.imgur.com/Po2CtN7.jpg); background-position: 0px -22px; } ' +
                '.place_simulator_table .place_image.pa_priest { background: url(https://i.imgur.com/Po2CtN7.jpg); background-position: -66px -88px; } ' +
                '.place_simulator_table .place_image.alliance_modifier { background: url(https://i.imgur.com/WYaJuyK.png); background-position: -20px -80px; } ' +
                '.place_simulator_table .place_image.building_tower { background: url(https://i.imgur.com/WYaJuyK.png); background-position: -40px -40px; } ' +
                '.place_simulator_table .place_image.ground_factor { background: url(https://i.imgur.com/WYaJuyK.png); background-position: -20px -20px; } ' +
                '.place_simulator_table .place_image.naval_factor { background: url(https://i.imgur.com/WYaJuyK.png); background-position: -20px -40px; } ' +
                '.place_simulator_table .place_image.luck { background: url(https://i.imgur.com/WYaJuyK.png); background-position: -40px -20px; } ' +
                '.place_simulator_table .place_image.morale { background: url(https://i.imgur.com/WYaJuyK.png); background-position: 0px 40px; } ' +
                '.place_simulator_table .place_image.wall_level { background: url(https://i.imgur.com/WYaJuyK.png); background-position: -60px -60px; } ' +
                '.place_image.strategy_breach { background: url(https://i.imgur.com/WYaJuyK.png); background-position: -80px 80px; } ' +
                '.place_simulator_table .place_image.is_night { background: url(https://i.imgur.com/WYaJuyK.png); background-position: 60px 0px; } ' +
                '.place_simulator_table .place_image.research_ram { background: url(https://i.imgur.com/WYaJuyK.png); background-position: -40px -60px; } ' +
                '.place_simulator_table .place_image.research_phalanx { background: url(https://i.imgur.com/WYaJuyK.png); background-position: -20px -60px; }' +
                '.place_simulator_table .place_image.research_divine_selection { background: url(https://i.imgur.com/WYaJuyK.png); background-position: 0px 20px; }' +
                '.place_simulator_table .place_image.research_combat_experience { background: url(https://i.imgur.com/WYaJuyK.png); background-position: 0px 60px; }' +
                '.place_sim_wrap_mods_extended .place_cross { height:16px; background:none; } ' +
                '.place_sim_wrap_mods_extended .place_checkbox_field { display:table-cell; width:13px; height:13px; } ' +
                '.place_sim_wrap_mods_extended tr:last-child { display:none;} ' +
                '.place_sim_wrap_mods_extended tr:nth-of-type(3) td, .place_sim_wrap_mods_extended tr:nth-of-type(5) td { border-top: 2px solid #BFA978 !important; padding-top: 3px !important} ' +
                '.place_sim_wrap_mods_extended .game_border>div { display:none; } ' +
                '.place_sim_wrap_mods_extended .game_border { margin:0px; } ' +
                '.place_sim_wrap_mods_extended .game_border { height: 139px; overflow-y: auto; overflow-x: hidden; }' +
                '#place_simulator .window_inner_curtain { display: none !important } ' +
                '#simulator_body .unit_container { height: 50px !important; width: 50px !important; margin: 0px 3px 0px 1px !important} ' +
                '.place_simulator_odd, .place_simulator_even { text-align: center !important} ' +
                '.place_insert_field { margin: 0px !important}  ' +
                '#place_sim_ground_units { position:absolute; bottom: 35px;} ' +
                '#place_sim_battlepoints { position: absolute; top: 300px; right: 2px;} ' +
                '#place_sim_naval_units { position: absolute; } ' +
                '#place_sim_naval_units tbody tr:last-child { height:auto !important; }' +
                '#place_sim_wrap_units { position: absolute !important; bottom: 35px !important} ' +
                '#simulator_body>h4 { position:absolute;bottom:188px;} ' +
                '.place_sim_select_gods_wrap { position:absolute; bottom:182px; } ' +
                '.place_sim_select_gods_wrap .place_sim_select_gods { width: 150px; } ' +
                '.place_sim_select_gods_wrap select { max-width: 120px; } ' +
                '.place_sim_select_gods_wrap .place_symbol, .place_sim_select_strategies .place_symbol { margin: 1px 2px 0px 5px !important} ' +
                '.place_sim_insert_units .place_symbol { filter: hue-rotate(330deg); -webkit-filter: hue-rotate(330deg);} ' +
                '.place_attack { float: left !important} ' +
                '.place_sim_heroes_container { position: absolute; right: 0px; z-index: 1; } ' +
                '.place_sim_hero_container { width: 45px !important; height: 25px !important} ' +
                '#place_simulator .place_sim_bonuses_heroes h4:nth-of-type(2) { display:none; }' +
                '.place_sim_hero_choose, .place_sim_hero_unit_container { height: 26px !important; width: 30px !important} ' +
                '#hero_defense_icon, #hero_attack_icon { height: 25px !important; width: 25px !important; margin: 0px !important} ' +
                '#hero_defense_dd, #hero_attack_dd { height: 25px !important; width: 25px !important; margin: 1px !important} ' +
                '.place_sim_hero_attack, .place_sim_hero_defense { margin-left: 3px !important} ' +
                '#hero_attack_text, #hero_defense_text { font-size: 11px !important; bottom: 0px !important} ' +
                '.place_sim_heroes_container .plus { left: 2px; top: 2px !important} ' +
                '.place_sim_heroes_container .button_new.square { left: 2px !important; } ' +
                '.place_sim_heroes_container .spinner { height: 25px !important; width: 40px !important } ' +
                '.place_sim_heroes_container td:nth-child(0) { height: 30px !important} ' +
                '.place_sim_heroes_container .spinner { height: 24px !important; position:absolute !important; width:12px !important; left:29px !important; ' +
                'background:url(https://gpall.innogamescdn.com/images/game/border/odd.png) repeat !important; border: 1px solid rgb(107, 107, 107) !important; } ' +
                '.place_sim_heroes_container .spinner .button_down, .place_sim_heroes_container .spinner .button_up { bottom: 2px !important; cursor: pointer !important} ' +
                '.place_sim_heroes_container .spinner .border_l, .place_sim_heroes_container .spinner .border_r, .place_sim_heroes_container .spinner .body { display:none; } ' +
                '#q_place_sim_lost_res { display: none; } ' +
                '</style>').appendTo('head');
            if ($('#place_simulator').get(0)) {
                Simulator.change();
            }
            SimulatorStrength.activate();
        },
        deactivate: function() {
            $('#joe_simulator_style').remove();
            if ($('#simu_table').get(0)) {
                $('#simu_table').remove();
                if ($('.place_sim_heroes_container').get(0)) {
                    $('.hero_unit').each(function() {
                        $(this).addClass('unit_icon40x40').removeClass('unit_icon25x25');
                    });
                    $('.place_sim_heroes_container .spinner').each(function() {
                        $(this).addClass('place_sim_hero_spinner');
                    });
                }
            }
            SimulatorStrength.deactivate();
        },
        change: function() {
            $('.place_sim_wrap_mods tr:eq(1) td:eq(5)').html('<span id="building_place_def_losses_wall_level" class="place_losses bold"></span>');
            $('.place_sim_wrap_mods_extended .power').each(function() {
                $(this).removeClass("power_icon45x45").addClass("power_icon16x16");
            });
            $('.place_sim_wrap_mods_extended td:nth-child(even)').each(function() {
                $(this).addClass("left_border place_simulator_odd");
            });
            $('.place_sim_wrap_mods_extended td:nth-child(odd)').each(function() {
                $(this).addClass("left_border place_simulator_even");
            });
            $('.place_sim_wrap_mods_extend td:first-child').each(function() {
                $(this).removeClass("left_border");
            });
            $('.place_checkbox_field').click(function() {
                FightSimulator.closeModsExtended();
            });
            if (uw.Game.hasArtemis) {
                $('.place_sim_wrap_mods_extend tr').each(function() {
                    this.children[1].style.borderLeft = "none";
                    this.children[0].remove();
                });
            }
            if ($('.place_sim_heroes_container').get(0)) {
                $('.hero_unit').each(function() {
                    $(this).removeClass('unit_icon40x40').addClass('unit_icon25x25');
                });
                $('.place_sim_heroes_container .spinner').each(function() {
                    $(this).removeClass('place_sim_hero_spinner');
                });
            }
            setStrengthSimulator();
        }
    };
    function afterSimulation() {
        var lossArray = {
                att: {
                    res: 0,
                    fav: 0,
                    pop: 0
                },
                def: {
                    res: 0,
                    fav: 0,
                    pop: 0
                }
            },
            wall_level = parseInt($('.place_sim_wrap_mods .place_insert_field[name="sim[mods][def][wall_level]"]').val(), 10),
            wall_damage = parseInt($('#building_place_def_losses_wall_level').get(0).innerHTML, 10),
            wall_iron = [0, 200, 429, 670, 919, 1175, 1435, 1701, 1970, 2242, 2518, 2796, 3077, 3360, 3646, 3933, 4222, 4514, 4807, 5101, 5397, 5695, 5994, 6294, 6596, 6899];
        $('#place_sim_ground_units .place_losses, #place_sim_naval_units .place_losses').each(function() {
            var loss = parseInt(this.innerHTML, 10) || 0;
            if (loss > 0) {
                var unit = this.id.substring(26);
                var side = this.id.split("_")[2];
                lossArray[side].res += loss * (uw.GameData.units[unit].resources.wood + uw.GameData.units[unit].resources.stone + uw.GameData.units[unit].resources.iron);
                lossArray[side].fav += loss * uw.GameData.units[unit].favor;
                lossArray[side].pop += loss * uw.GameData.units[unit].population;
            }
        });
        for (var w = wall_level; w > wall_level - wall_damage; w--) {
            lossArray.def.res += 400 + w * 350 + wall_iron[w];
        }
        for (var x in lossArray) {
            if (lossArray.hasOwnProperty(x)) {
                for (var z in lossArray[x]) {
                    if (lossArray[x].hasOwnProperty(z)) {
                        $("#" + x + "_" + z).get(0).innerHTML = ((z === "res") && (lossArray[x][z] > 10000)) ? (Math.round(lossArray[x][z] / 1000) + "k") : lossArray[x][z];
                    }
                }
            }
        }
    }
    var unitsGround = {
            att: {},
            def: {}
        },
        unitsNaval = {
            att: {},
            def: {}
        },
        name = "";
    var SimulatorStrength = {
        unitsGround: {
            att: {},
            def: {}
        },
        unitsNaval: {
            att: {},
            def: {}
        },
        activate: function() {
            $('<style id="joe_simulator_strength_style">' +
                '#joe_simulator_strength { position:absolute; top:192px; font-size:0.8em; width:63%; } ' +
                '#joe_simulator_strength .ico { height:20px; width:20px; margin:auto; } ' +
                '#joe_simulator_strength .units_info_sprite { background:url(https://gpall.innogamescdn.com/images/game/units/units_info_sprite2.51.png); background-size:100%; } ' +
                '#joe_simulator_strength .img_hack { background-position:0% 36%; } ' +
                '#joe_simulator_strength .img_pierce { background-position:0% 27%; } ' +
                '#joe_simulator_strength .img_dist { background-position:0% 45% !important; } ' +
                '#joe_simulator_strength .img_ship { background-position:0% 72%; } ' +
                '#joe_simulator_strength .img_fav { background: url(https://gpall.innogamescdn.com/images/game/res/favor.png) !important; background-size: 100%; } ' +
                '#joe_simulator_strength .img_res { background: url(https://gpall.innogamescdn.com/images/game/units/units_info_sprite2.51.png) 0% 54%; background-size: 100%; } ' +
                '#joe_simulator_strength .img_pop { background: url(https://gpall.innogamescdn.com/images/game/res/pop.png); background-size:100%; } ' +
                '#joe_simulator_strength .left_border { width: 54px; } ' +
                '</style>'
            ).appendTo('head');
        },
        deactivate: function() {
            $('#joe_simulator_strength_style').remove();
        },
        add: function() {
            $('<div id="joe_simulator_strength">' +
                '<div style="float:left; margin-right:12px;"><h4>' + getText("labels", "str") + '</h4>' +
                '<table class="place_simulator_table strength" cellpadding="0px" cellspacing="0px" style="align:center;">' +
                '<tr>' +
                '<td class="place_simulator_even"></td>' +
                '<td class="left_border place_simulator_odd"><div class="ico units_info_sprite img_hack"></div></td>' +
                '<td class="left_border place_simulator_even"><div class="ico units_info_sprite img_pierce"></div></td>' +
                '<td class="left_border place_simulator_odd"><div class="ico units_info_sprite img_dist"></div></td>' +
                '<td class="left_border place_simulator_even"><div class="ico units_info_sprite img_ship"></div></td>' +
                '</tr><tr>' +
                '<td class="place_simulator_even"><div class="place_symbol place_att"></div></td>' +
                '<td class="left_border place_simulator_odd" id="att_b">0</td>' +
                '<td class="left_border place_simulator_even" id="att_s">0</td>' +
                '<td class="left_border place_simulator_odd" id="att_d">0</td>' +
                '<td class="left_border place_simulator_even" id="att_ship">0</td>' +
                '</tr><tr>' +
                '<td class="place_simulator_even"><div class="place_symbol place_def"></div></td>' +
                '<td class="left_border place_simulator_odd" id="def_b">0</td>' +
                '<td class="left_border place_simulator_even" id="def_s">0</td>' +
                '<td class="left_border place_simulator_odd" id="def_d">0</td>' +
                '<td class="left_border place_simulator_even" id="def_ship">0</td>' +
                '</tr>' +
                '</table>' +
                '</div><div><h4>' + getText("labels", "los") + '</h4>' +
                '<table class="place_simulator_table loss" cellpadding="0px" cellspacing="0px" style="align:center;">' +
                '<tr>' +
                '<td class="place_simulator_even"></td>' +
                '<td class="left_border place_simulator_odd"><div class="ico units_info_sprite img_res"></div></td>' +
                '<td class="left_border place_simulator_even"><div class="ico units_info_sprite img_fav"></div></td>' +
                '<td class="left_border place_simulator_odd"><div class="ico units_info_sprite img_pop"></div></td>' +
                '</tr><tr>' +
                '<td class="place_simulator_even"><div class="place_symbol place_att"></div></td>' +
                '<td class="left_border place_simulator_odd" id="att_res">0</td>' +
                '<td class="left_border place_simulator_even" id="att_fav">0</td>' +
                '<td class="left_border place_simulator_odd" id="att_pop">0</td>' +
                '</tr><tr>' +
                '<td class="place_simulator_even"><div class="place_symbol place_def"></div></td>' +
                '<td class="left_border place_simulator_odd" id="def_res">0</td>' +
                '<td class="left_border place_simulator_even" id="def_fav">0</td>' +
                '<td class="left_border place_simulator_odd" id="def_pop">0</td>' +
                '</tr>' +
                '</table>' +
                '</div></div>').appendTo('#simulator_body');
            $('#joe_simulator_strength .left_border').each(function() {
                $(this)[0].align = 'center';
            });
            $('#joe_simulator_strength .strength').tooltip(getText("labels", "str") + " (" + getText("labels", "mod") + ")");
            $('#joe_simulator_strength .loss').tooltip(getText("labels", "los"));
            $('.index_unit').click(function() {
                var type = $(this).attr('class').split(" ")[4];
                $('.place_insert_field[name="sim[units][att][' + type + ']"]').change();
            });
            $('#place_sim_ground_units .place_insert_field, #place_sim_naval_units .place_insert_field').on('input change', function() {
                name = $(this).attr("name").replace(/\]/g, "").split("[");
                var str = this;
                setTimeout(function() {
                    var unit_type = $(str).closest('.place_simulator_table').attr("id").split("_")[2],
                        val, e;
                    val = parseInt($(str).val(), 10);
                    val = val || 0;
                    if (unit_type == "ground") {
                        unitsGround[name[2]][name[3]] = val;
                        if (name[2] == "def") {
                            UnitStrength.calcDef(unitsGround.def);
                        } else {
                            UnitStrength.calcOff(unitsGround.att, unitsGround.att);
                        }
                        $('#' + name[2] + '_b').get(0).innerHTML = blunt;
                        $('#' + name[2] + '_s').get(0).innerHTML = sharp;
                        $('#' + name[2] + '_d').get(0).innerHTML = dist;
                    } else {
                        var att = 0,
                            def = 0;
                        unitsNaval[name[2]][name[3]] = val;
                        if (name[2] == "def") {
                            for (e in unitsNaval.def) {
                                if (unitsNaval.def.hasOwnProperty(e)) {
                                    def += unitsNaval.def[e] * uw.GameData.units[e].defense;
                                }
                            }
                            $('#def_ship').get(0).innerHTML = def;

                        } else {
                            for (e in unitsNaval.att) {
                                if (unitsNaval.att.hasOwnProperty(e)) {
                                    att += unitsNaval.att[e] * uw.GameData.units[e].attack;
                                }
                            }
                            $('#att_ship').get(0).innerHTML = att;
                        }
                    }
                }, 100);
            });
            getUnitInputs();
            setTimeout(function() {
                setChangeUnitInputs("def");
            }, 100);
            $('#select_insert_units').change(function() {
                var side = $(this).find('option:selected').val();
                setTimeout(function() {
                    getUnitInputs();
                    if (side === "att" || side === "def") {
                        setChangeUnitInputs(side);
                    }
                }, 200);
            });
        },
        getUnitInputs: function() {
            $('#place_sim_ground_units .place_insert_field, #place_sim_naval_units .place_insert_field').each(function() {
                var name = $(this).attr("name").replace(/\]/g, "").split("[");
                var str = this;
                var unit_type = $(str).closest('.place_simulator_table').attr("id").split("_")[2];
                var val = parseInt($(str).val(), 10);
                val = val || 0;
                if (unit_type === "ground") {
                    SimulatorStrength.unitsGround[name[2]][name[3]] = val;
                } else {
                    SimulatorStrength.unitsNaval[name[2]][name[3]] = val;
                }
            });
        },
        updateStrength: function() {}
    }
    function setStrengthSimulator() {
        $('<div id="joe_simulator_strength">' +
            '<div style="float:left; margin-right:12px;"><h4>' + getText("labels", "str") + '</h4>' +
            '<table class="place_simulator_table strength" cellpadding="0px" cellspacing="0px" style="align:center;">' +
            '<tr>' +
            '<td class="place_simulator_even"></td>' +
            '<td class="left_border place_simulator_odd"><div class="ico units_info_sprite img_hack"></div></td>' +
            '<td class="left_border place_simulator_even"><div class="ico units_info_sprite img_pierce"></div></td>' +
            '<td class="left_border place_simulator_odd"><div class="ico units_info_sprite img_dist"></div></td>' +
            '<td class="left_border place_simulator_even"><div class="ico units_info_sprite img_ship"></div></td>' +
            '</tr><tr>' +
            '<td class="place_simulator_even"><div class="place_symbol place_att"></div></td>' +
            '<td class="left_border place_simulator_odd" id="att_b">0</td>' +
            '<td class="left_border place_simulator_even" id="att_s">0</td>' +
            '<td class="left_border place_simulator_odd" id="att_d">0</td>' +
            '<td class="left_border place_simulator_even" id="att_ship">0</td>' +
            '</tr><tr>' +
            '<td class="place_simulator_even"><div class="place_symbol place_def"></div></td>' +
            '<td class="left_border place_simulator_odd" id="def_b">0</td>' +
            '<td class="left_border place_simulator_even" id="def_s">0</td>' +
            '<td class="left_border place_simulator_odd" id="def_d">0</td>' +
            '<td class="left_border place_simulator_even" id="def_ship">0</td>' +
            '</tr>' +
            '</table>' +
            '</div><div><h4>' + getText("labels", "los") + '</h4>' +
            '<table class="place_simulator_table loss" cellpadding="0px" cellspacing="0px" style="align:center;">' +
            '<tr>' +
            '<td class="place_simulator_even"></td>' +
            '<td class="left_border place_simulator_odd"><div class="ico units_info_sprite img_res"></div></td>' +
            '<td class="left_border place_simulator_even"><div class="ico units_info_sprite img_fav"></div></td>' +
            '<td class="left_border place_simulator_odd"><div class="ico units_info_sprite img_pop"></div></td>' +
            '</tr><tr>' +
            '<td class="place_simulator_even"><div class="place_symbol place_att"></div></td>' +
            '<td class="left_border place_simulator_odd" id="att_res">0</td>' +
            '<td class="left_border place_simulator_even" id="att_fav">0</td>' +
            '<td class="left_border place_simulator_odd" id="att_pop">0</td>' +
            '</tr><tr>' +
            '<td class="place_simulator_even"><div class="place_symbol place_def"></div></td>' +
            '<td class="left_border place_simulator_odd" id="def_res">0</td>' +
            '<td class="left_border place_simulator_even" id="def_fav">0</td>' +
            '<td class="left_border place_simulator_odd" id="def_pop">0</td>' +
            '</tr>' +
            '</table>' +
            '</div></div>').appendTo('#simulator_body');
        $('#joe_simulator_strength .left_border').each(function() {
            $(this)[0].align = 'center';
        });
        $('#joe_simulator_strength .strength').tooltip(getText("labels", "str") + " (" + getText("labels", "mod") + ")");
        $('#joe_simulator_strength .loss').tooltip(getText("labels", "los"));
        $('.index_unit').click(function() {
            var type = $(this).attr('class').split(" ")[4];
            $('.place_insert_field[name="sim[units][att][' + type + ']"]').change();
        });
        $('#place_sim_ground_units .place_insert_field, #place_sim_naval_units .place_insert_field').on('input change', function() {
            name = $(this).attr("name").replace(/\]/g, "").split("[");
            var str = this;
            setTimeout(function() {
                var unit_type = $(str).closest('.place_simulator_table').attr("id").split("_")[2],
                    val, e;
                val = parseInt($(str).val(), 10);
                val = val || 0;
                if (unit_type == "ground") {
                    unitsGround[name[2]][name[3]] = val;
                    if (name[2] == "def") {
                        UnitStrength.calcDef(unitsGround.def);
                    } else {
                        UnitStrength.calcOff(unitsGround.att, unitsGround.att);
                    }
                    $('#' + name[2] + '_b').get(0).innerHTML = blunt;
                    $('#' + name[2] + '_s').get(0).innerHTML = sharp;
                    $('#' + name[2] + '_d').get(0).innerHTML = dist;
                } else {
                    var att = 0,
                        def = 0;
                    unitsNaval[name[2]][name[3]] = val;
                    if (name[2] == "def") {
                        for (e in unitsNaval.def) {
                            if (unitsNaval.def.hasOwnProperty(e)) {
                                def += unitsNaval.def[e] * uw.GameData.units[e].defense;
                            }
                        }
                        $('#def_ship').get(0).innerHTML = def;
                    } else {
                        for (e in unitsNaval.att) {
                            if (unitsNaval.att.hasOwnProperty(e)) {
                                att += unitsNaval.att[e] * uw.GameData.units[e].attack;
                            }
                        }
                        $('#att_ship').get(0).innerHTML = att;
                    }
                }
            }, 100);
        });
        getUnitInputs();
        setTimeout(function() {
            setChangeUnitInputs("def");
        }, 100);
        $('#select_insert_units').change(function() {
            var side = $(this).find('option:selected').val();
            setTimeout(function() {
                getUnitInputs();
                if (side === "att" || side === "def") {
                    setChangeUnitInputs(side);
                }
            }, 200);
        });
    }
    function getUnitInputs() {
        $('#place_sim_ground_units .place_insert_field, #place_sim_naval_units .place_insert_field').each(function() {
            name = $(this).attr("name").replace(/\]/g, "").split("[");
            var str = this;
            var unit_type = $(str).closest('.place_simulator_table').attr("id").split("_")[2];
            var val = parseInt($(str).val(), 10);
            val = val || 0;
            if (unit_type === "ground") {
                unitsGround[name[2]][name[3]] = val;
            } else {
                unitsNaval[name[2]][name[3]] = val;
            }
        });
    }
    function setChangeUnitInputs(side) {
        $('.place_insert_field[name="sim[units][' + side + '][godsent]"]').change();
        setTimeout(function() {
            $('.place_insert_field[name="sim[units][' + side + '][colonize_ship]"]').change();
        }, 100);
    }
    ///////////////////////////////////
   //       * Defense form *        //
  ///////////////////////////////////
    function addForm(e) {
        var textareaId = "",
            bbcodeBarId = "";
        switch (e) {
            case "/alliance_forum/forum":
                textareaId = "#forum_post_textarea";
                bbcodeBarId = "#forum";
                break;
            case "/message/forward":
                textareaId = "#message_message";
                bbcodeBarId = "#message_bbcodes";
                break;
            case "/message/new":
                textareaId = "#message_new_message";
                bbcodeBarId = "#message_bbcodes";
                break;
            case "/message/view":
                textareaId = "#message_reply_message";
                bbcodeBarId = "#message_bbcodes";
                break;
            case "/player_memo/load_memo_content":
                textareaId = "#memo_text_area";
                bbcodeBarId = "#memo_edit";
                break;
        }
        $('<a title="formulario Pedido de apoio" href="#" class="joe_bbcode_option def_form" name="def_form"></a>').appendTo(bbcodeBarId + ' .bb_button_wrapper');
        $('.def_form_button').css({
            cursor: 'pointer',
            marginTop: '3px'
        });
        $(bbcodeBarId + ' .joe_bbcode_option').css({
            background: 'url("https://i.imgur.com/Cho3XXa.png")',
            display: 'block',
            float: 'left',
            width: '22px',
            height: '23px',
            margin: '0 3px 0 0',
            position: 'relative'
        });
        $(bbcodeBarId + ' .def_form').css({
            backgroundPosition: '-0px 0px'
        });
        var imgArray = {
            Gatinhno: 'https://i.imgur.com/f8WfWVa.gif',
            OC: 'https://i.imgur.com/wr54ZjX.png',
            SOS: 'https://i.imgur.com/77prwjs.png',
            Bir1: 'https://i.imgur.com/gmAbbZz.png',
            Def1: 'https://i.imgur.com/9F5OQ3D.png',
            Rev2: 'https://i.imgur.com/ZauWa5y.gif',
            WallUp: 'https://i.imgur.com/igYPwnY.gif',
            wall: 'https://i.imgur.com/jTXJQug.png',
            tower: 'https://i.imgur.com/GnHjHZ9.png',
            hide: 'https://i.imgur.com/vso6iFo.png',
            R121: 'https://i.imgur.com/UnsgrPN.jpg',
            spy: 'https://i.imgur.com/xPwSQDw.png',
            pop: 'https://i.imgur.com/QbEvOtP.png',
            rev1: 'https://i.imgur.com/5TZV6iO.png',
            rev0: 'https://i.imgur.com/sthvlrb.png',
            eo1: 'https://i.imgur.com/N56tgu8.png',
            eo0: 'https://i.imgur.com/WewQmv0.png',
            att: 'https://i.imgur.com/UoW6baP.png',
            sup: 'https://i.imgur.com/dRLeuIj.png',
            zeus: 'https://i.imgur.com/IdhRkTK.png',
            hera: 'https://i.imgur.com/fYmE85i.png',
            athena: 'https://i.imgur.com/tffuYu3.png',
            poseidon: 'https://i.imgur.com/97QksKa.png',
            hades: 'https://i.imgur.com/msvKejH.png',
            artemis: 'https://i.imgur.com/kDfJ0As.png',
            nogod: 'https://i.imgur.com/Sqtq1Lf.png',
            aphrodite: 'https://i.imgur.com/NpR2iDs.png',
            ares: 'https://i.imgur.com/hvDmgGg.png',
            captain: 'https://i.imgur.com/D2nTWfA.png',
            commander: 'https://i.imgur.com/WpizBqK.png',
            priest: 'https://i.imgur.com/I1NQ286.png',
            phalanx: 'https://i.imgur.com/caFyMbF.png',
            ram: 'https://i.imgur.com/MLlEmBW.png',
            divine_selection: 'https://i.imgur.com/WAsceCi.png',
            militia: 'https://wiki.en.grepolis.com/images/9/9b/Militia_40x40.png',
            sword: 'https://wiki.en.grepolis.com/images/9/9c/Sword_40x40.png',
            slinger: 'https://wiki.en.grepolis.com/images/d/dc/Slinger_40x40.png',
            archer: 'https://wiki.en.grepolis.com/images/1/1a/Archer_40x40.png',
            hoplite: 'https://wiki.en.grepolis.com/images/b/bd/Hoplite_40x40.png',
            rider: 'https://wiki.en.grepolis.com/images/e/e9/Rider_40x40.png',
            chariot: 'https://wiki.en.grepolis.com/images/b/b8/Chariot_40x40.png',
            catapult: 'https://wiki.en.grepolis.com/images/f/f0/Catapult_40x40.png',
            godsent: 'https://wiki.de.grepolis.com/images/6/6e/Grepolis_Wiki_225.png',
            def_sum: 'https://i.imgur.com/Ncr2xOj.png',
            minotaur: 'https://wiki.de.grepolis.com/images/7/70/Minotaur_40x40.png',
            manticore: 'https://wiki.de.grepolis.com/images/5/5e/Manticore_40x40.png',
            zyclop: 'https://wiki.de.grepolis.com/images/6/66/Zyklop_40x40.png',
            sea_monster: 'https://wiki.de.grepolis.com/images/7/70/Sea_monster_40x40.png',
            harpy: 'https://wiki.de.grepolis.com/images/8/80/Harpy_40x40.png',
            medusa: 'https://wiki.de.grepolis.com/images/d/db/Medusa_40x40.png',
            centaur: 'https://wiki.de.grepolis.com/images/5/53/Centaur_40x40.png',
            pegasus: 'https://wiki.de.grepolis.com/images/5/54/Pegasus_40x40.png',
            cerberus: 'https://wiki.de.grepolis.com/images/6/67/Zerberus_40x40.png',
            fury: 'https://wiki.de.grepolis.com/images/6/67/Erinys_40x40.png',
            griffin: 'https://wiki.de.grepolis.com/images/d/d1/Unit_greif.png',
            calydonian_boar: 'https://wiki.de.grepolis.com/images/9/93/Unit_eber.png',
            spartoi: 'https://i.imgur.com/25B92c8.png',
            siren: 'https://i.imgur.com/MEqScUq.png',
            satyr: 'https://i.imgur.com/aICZhnx.png',
            ladon: 'https://i.imgur.com/8mSAgjb.png',
            big_transporter: 'https://wiki.en.grepolis.com/images/0/04/Big_transporter_40x40.png',
            bireme: 'https://wiki.en.grepolis.com/images/4/44/Bireme_40x40.png',
            attack_ship: 'https://wiki.en.grepolis.com/images/e/e6/Attack_ship_40x40.png',
            demolition_ship: 'https://wiki.en.grepolis.com/images/e/ec/Demolition_ship_40x40.png',
            small_transporter: 'https://wiki.en.grepolis.com/images/8/85/Small_transporter_40x40.png',
            trireme: 'https://wiki.en.grepolis.com/images/a/ad/Trireme_40x40.png',
            colonize_ship: 'https://wiki.en.grepolis.com/images/d/d1/Colonize_ship_40x40.png',
            move_icon: 'https://gpall.innogamescdn.com/images/game/unit_overview/attack.png',
            bordure: 'https://i.imgur.com/UPAkYNo.jpg',
            bordure2: 'https://i.imgur.com/ZjSSB4A.png'
        };
        $('<div class="bb_def_chooser">' +
            '<div class="bbcode_box middle_center">' +
            '<div class="bbcode_box top_left"></div><div class="bbcode_box top_right"></div>' +
            '<div class="bbcode_box top_center"></div><div class="bbcode_box bottom_center"></div>' +
            '<div class="bbcode_box bottom_right"></div><div class="bbcode_box bottom_left"></div>' +
            '<div class="bbcode_box middle_left"></div><div class="bbcode_box middle_right"></div>' +
            '<div class="bbcode_box content clearfix" style="padding:5px">' +
            '<div id="footer style="font-size: 6px"><li></li></div>' +
            '<div id="f_uni" class="checkbox_new"><div class="cbx_icon" id="UNI"></div><div class="cbx_caption">' + getText("labels", "det") + '</div></div>' +
            '<div id="footer" style="font-size: 10px">' + getText("labels", "fooster") + '</div>' +
            '<div id="f_NTS" class="checkbox_new"><div class="cbx_icon" id="NTS"></div><div class="cbx_caption">' + getText("labels", "NTS") + '</div></div>' +
            '<div id="footer" style="font-size: 6px"><li></li></div><br>' +
            '<div id="f_Bir1" class="checkbox_new checked"><div class="cbx_icon"></div><div class="cbx_caption">' + getText("labels", "Bir1") + '</div></div><br><br>' +
            '<div id="f_Def1" class="checkbox_new checked"><div class="cbx_icon"></div><div class="cbx_caption">' + getText("labels", "Def1") + '</div></div><br><br>' +
            '<div id="f_Rev2" class="checkbox_new checked"><div class="cbx_icon"></div><div class="cbx_caption">' + getText("labels", "Rev2") + '</div></div><br><br>' +
            '<div id="f_WaUp" class="checkbox_new checked"><div class="cbx_icon"></div><div class="cbx_caption">' + getText("labels", "WaUp") + '</div></div><br><br>' +
            '<div id="f_prm" class="checkbox_new checked"><div class="cbx_icon"></div><div class="cbx_caption">' + getText("labels", "prm") + '</div></div><br><br>' +
            '<div id="f_sil" class="checkbox_new checked"><div class="cbx_icon"></div><div class="cbx_caption">' + getText("labels", "sil") + '</div></div><br><br>' +
            '<div id="f_OC" class="checkbox_new checked"><div class="cbx_icon"></div><div class="cbx_caption">' + getText("labels", "OC") + '</div></div><br><br>' +
            '<div id="f_R212" class="checkbox_new"><div class="cbx_icon"></div><div class="cbx_caption">' + getText("labels", "f_R212") + '</div></div><br><br>' +
            '<div id="f_R210" class="checkbox_new"><div class="cbx_icon"></div><div class="cbx_caption">' + getText("labels", "f_R210") + '</div></div><br><br>' +
            '<div><a class="button" id="joe_insert" href="#"><span class="left"><span class="right"><span class="middle"><small>' + joe_icon + '' + getText("buttons", "ins") + '</small></span></span></span><span></span></a></div>' +
            '</div></div></div>').appendTo(bbcodeBarId + ' .bb_button_wrapper');
        $('#f_uni').css("font-weight", "bold");
        $('#f_uni').css("font-size", "12px");
        $('#f_uni').css("text-shadow", "rgba(92, 255, 0, 0.57) 0px 5px 10px");
        $('#f_NTS').css("font-weight", "bold");
        $('#f_NTS').css("font-size", "12px");
        $('#f_NTS').css("text-shadow", "rgba(92, 255, 0, 0.57) 0px 5px 10px");
        $('#UNI').css("-webkit-box-shadow", "0px 0px 3px 1px #ff00006b");
        $('#UNI').css("-moz-box-shadow", "0px 0px 3px 1px #ff00006b");
        $('#UNI').css("box-shadow", "0px 0px 3px 1px #ff00006b");
        $('#NTS').css("-webkit-box-shadow", "0px 0px 3px 1px #ff00006b");
        $('#NTS').css("-moz-box-shadow", "0px 0px 3px 1px #ff00006b");
        $('#NTS').css("box-shadow", "0px 0px 3px 1px #ff00006b");
        $('.bb_def_chooser').css({
            display: 'none',
            top: '38px',
            left: '510px',
            position: 'absolute',
            width: '190px',
            zIndex: 10000
        });
        $(bbcodeBarId + " .bb_def_chooser .checkbox_new").click(function() {
            $(this).toggleClass("checked");
        });
        $(bbcodeBarId + ' .def_form').toggleClick(function() {
            $(this).parent().find(".bb_def_chooser").get(0).style.display = "block";
        }, function() {
            $(this).parent().find(".bb_def_chooser").get(0).style.display = "none";
        });
        var options = {
            year: 'numeric',
            day: 'numeric',
            month: 'numeric'
        };
        var today = new Date();
        var now = new Date();
        var ddd = new Date(now.setDate(now.getDate() + 1));
        console.log(ddd.toLocaleDateString("en-GB"));
        console.log(today.toLocaleDateString("en-GB"));
        ddm =
            ddd = ddd.toLocaleDateString("en-GB");
        DFR2 = today.toLocaleDateString("en-GB");
        Server = Chat.formatTime(Timestamp.server());
        Server_H = Chat.formatTime(Timestamp.server() + 43200);
        HR212 = Chat.formatTime(Timestamp.server() + 43200);
        HR210 = Chat.formatTime(Timestamp.server() + 36000);
        HFR212 = Chat.formatTime(Timestamp.server() + 86400);
        HFR210 = Chat.formatTime(Timestamp.server() + 72000);
        OC1 = parseInt(uw.WMap.getSea(uw.WMap.getXCoord()));
        OC2 = parseInt(uw.WMap.getSea(uw.WMap.getYCoord()));
        bireme1 = parseInt(uw.ITowns.getTown(uw.Game.townId).unitsOuter().bireme, 10);
        if (isNaN(bireme1)) bireme1 = 0;
        trireme1 = parseInt(uw.ITowns.getTown(uw.Game.townId).unitsOuter().trireme, 10);
        if (isNaN(trireme1)) trireme1 = 0;
        $(bbcodeBarId + ' #joe_insert').click(function() {
            var textarea = $(textareaId).get(0),
                text = $(textarea).val(),
                troop_table = "",
                troop_img = "",
                troop_count = "",
                separator = "",
                move_table = "",
                landunit_sum = 0;
            $('.def_form').click();
            if ($('#f_uni').hasClass("checked")) {
                $('.units_land .unit, .units_naval .unit').each(function() {
                    troop_img += separator + '[img]' + imgArray[this.className.split(" ")[1]] + '[/img]';
                    troop_count += separator + '[center]' + $(this).find(".value").get(0).innerHTML + '[/center]';
                    separator = "[||]";
                });
            } else {
                $('.units_land .unit').each(function() {
                    var a = this.className.split(" ")[1],
                        def = (uw.GameData.units[a].def_hack + uw.GameData.units[a].def_pierce + uw.GameData.units[a].def_distance) / (3 * uw.GameData.units[a].population);
                    if (def > 10) {
                        landunit_sum += parseInt($(this).find(".value").get(0).innerHTML, 10) * uw.GameData.units[a].population * ((def > 20) ? 2 : 1);
                    }
                });
                landunit_sum = (landunit_sum > 10000) ? ((Math.round(landunit_sum / 100)) / 10) + "k" : landunit_sum;
                troop_img += '[img]' + imgArray.def_sum + '[/img]';
                troop_count += '[center]' + landunit_sum + '[/center]';
                separator = "[||]";
                $('.units_naval .unit').each(function() {
                    troop_img += separator + '[img]' + imgArray[this.className.split(" ")[1]] + '[/img]';
                    troop_count += separator + '[center]' + $(this).find(".value").get(0).innerHTML + '[/center]';
                });
            }
            if (troop_img !== "") {
                troop_table = "\n[table][**]" + troop_img + "[/**][**]" + troop_count + "[/**][/table]\n";
            }
            var str = '[center]' + '[font=serif]' + '\n\n[color=#07701B][size=18][u][b]' + getText("labels", "ttl") + ' [/b][/u][/size][/color]\n' + '[/font]' + '[/center]' +
                ($('#f_R212').hasClass("checked") ? '[size=6] [b] OC ' + OC1 + OC2 + '|[/b][town]' + uw.ITowns.getTown(uw.Game.townId).getId() + '[/town][b]|R2: [/size]' + '[color=#28045A][size=6][i][b]' + HR212 + '[/b][/i][/size][/color]\n' : ' ') +
                ($('#f_R210').hasClass("checked") ? '[size=6] [b] OC ' + OC1 + OC2 + '|[/b][town]' + uw.ITowns.getTown(uw.Game.townId).getId() + '[/town][b]|R2: [/size]' + '[color=#28045A][size=6][i][b]' + HR210 + '[/b][/i][/size][/color]\n' : ' ') +
                '[center]' + '[img]' + imgArray.bordure + '[/img]' + '[/center]' +
                '[center]' + ($('#f_Rev2').hasClass("checked") ? '[img]' + imgArray.Rev2 + '[/img]' : ' ') +
                '[size=11][town]' + uw.ITowns.getTown(uw.Game.townId).getId() + '[/town] ([player]' + uw.Game.player_name + '[/player]) [/size]' + '[/center]' +
                '\n[color=#28045A][size=11][i][b]' + getText("labels", "inf") + '[/b][/i][/size][/color]' +
                '[table][*]' +
                '[img]' + imgArray.wall + '[/img][|]\n' +
                '[img]' + imgArray.tower + '[/img][|]\n' +
                '[img]' + imgArray.phalanx + '[/img][|]\n' +
                '[img]' + imgArray.ram + '[/img][|]\n' +
                '[img]' + imgArray.divine_selection + '[/img][|]\n' +
                ($('#f_prm').hasClass("checked") ? '[img]' + imgArray.commander + '[/img][|]\n' : ' ') +
                ($('#f_prm').hasClass("checked") ? '[img]' + imgArray.captain + '[/img][|]\n' : ' ') +
                ($('#f_prm').hasClass("checked") ? '[img]' + imgArray.priest + '[/img][|]\n' : ' ') +
                ($('#f_sil').hasClass("checked") ? '[center][img]' + imgArray.spy + '[/img][/center][|]\n' : ' ') +
                '[img]' + imgArray.pop + '[/img][|]\n' +
                '[img]' + imgArray[(uw.ITowns.getTown(uw.Game.townId).god() || "nogod")] + '[/img][|]\n' +
                ($('#f_Bir1').hasClass("checked") ? '[img]' + imgArray.Bir1 + '[/img][|]\n' : ' ') +
                ($('#f_Def1').hasClass("checked") ? '[img]' + imgArray.Def1 + '[/img][|]\n' : ' ') +
                ($('#f_OC').hasClass("checked") ? '[img]' + imgArray.OC + '[/img][|]\n' : ' ') +
                '[img]' + imgArray.R121 + '[/img][/*]\n' +
                '[**][center]' + ($('#f_WaUp').hasClass("checked") ? '[img]' + imgArray.WallUp + '[/img]' : ' ') + uw.ITowns.getTown(uw.Game.townId).buildings().getBuildingLevel("wall") + '[/center][||]' +
                '[center]' + uw.ITowns.getTown(uw.Game.townId).buildings().getBuildingLevel("tower") + '[/center][||]' +
                '[center]' + (uw.ITowns.getTown(uw.Game.townId).researches().attributes.phalanx ? '[b][color=#004d00]✔️[/color][/b]' : '[b][color=#992600]❌[/color][/b]') + '[/center][||]' +
                '[center]' + (uw.ITowns.getTown(uw.Game.townId).researches().attributes.ram ? '[b][color=#004d00]✔️[/color][/b]' : '[b][color=#992600]❌[/color][/b]') + '[/center][||]' +
                '[center]' + (uw.ITowns.getTown(uw.Game.townId).researches().attributes.divine_selection ? '[b][color=#004d00]✔️[/color][/b]' : '[b][color=#992600]❌[/color][/b]') + '[/center][||]' +
                ($('#f_prm').hasClass("checked") ? '[center]' + ((uw.Game.premium_features.commander >= uw.Timestamp.now()) ? '[b][color=#004d00]✔️[/color][/b]' : '[b][color=#992600]❌[/color][/b]') + '[/center][||]' : ' ') +
                ($('#f_prm').hasClass("checked") ? '[center]' + ((uw.Game.premium_features.captain >= uw.Timestamp.now()) ? '[b][color=#004d00]✔️[/color][/b]' : '[b][color=#992600]❌[/color][/b]') + '[/center][||]' : ' ') +
                ($('#f_prm').hasClass("checked") ? '[center]' + ((uw.Game.premium_features.priest >= uw.Timestamp.now()) ? '[b][color=#004d00]✔️[/color][/b]' : '[b][color=#992600]❌[/color][/b]') + '[/center][||]' : ' ') +
                ($('#f_sil').hasClass("checked") ? '[center]' + Math.round(uw.ITowns.getTown(uw.Game.townId).getEspionageStorage() / 1000) + 'k[/center][||]' : ' ') +
                '[center]' + uw.ITowns.getTown(uw.Game.townId).getAvailablePopulation() + '[/center][||]' +
                '[center]' + $('.favor_amount').get(0).innerHTML + '[/center][||]' +
                ($('#f_Bir1').hasClass("checked") ? '[center][img]' + imgArray.SOS + '[/img][/center][||]' : ' ') +
                ($('#f_Def1').hasClass("checked") ? '[center][img]' + imgArray.SOS + '[/img][/center][||]' : ' ') +
                ($('#f_OC').hasClass("checked") ? '[center]' + OC1 + OC2 + '[/center][||]' : ' ') +
                ($('#f_R212').hasClass("checked") ? '[center][size=7]' + HR212 + '[/size][/center]' : ' ') +
                ($('#f_R210').hasClass("checked") ? '[center][size=7]' + HR210 + '[/size][/center]' : ' ') +
                '[/**][/table]' +
                ($('#f_uni').hasClass("checked") ? '[table][**]' + troop_img + '[/**][**]' + troop_count + '[/**][/table]\n' : ' ') +
                ($('#f_NTS').hasClass("checked") ? '[table][**]' + troop_img + '[/**][**]' + troop_count + '[/**][/table]\n' : ' ') +
                ($('#f_R212').hasClass("checked") ? '[color=#08781C][size=8][i][b]' + getText("labels", "R1") + '[/b][/i][/size][/color]' + '[color=#28045A][size=8][i][b]' + Server + '[/b][/i][/size][/color]' + ' \u00a0' + '' + '[color=#C11717][size=8][i][b]' + getText("labels", "FR2") + '[/b][/i][/size][/color]' + '[color=#28045A][size=8][i][b]' + HFR212 + ' \u00a0' + ddd + '[/b][/i][/size][/color]\n' : ' ') +
                ($('#f_R210').hasClass("checked") ? '[color=#08781C][size=8][i][b]' + getText("labels", "R1") + '[/b][/i][/size][/color]' + '[color=#28045A][size=8][i][b]' + Server + '[/b][/i][/size][/color]' + ' \u00a0' + '' + '[color=#C11717][size=8][i][b]' + getText("labels", "FR2") + '[/b][/i][/size][/color]' + '[color=#28045A][size=8][i][b]' + HFR210 + ' \u00a0' + ddm + '[/b][/i][/size][/color]\n' : ' ') +
                ($('#f_R212').hasClass("checked") ? ' ☆━━━━━━━━━━━━━━━━━☆━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━☆ ' + '\n' : ' ') +
                ($('#f_R210').hasClass("checked") ? ' ☆━━━━━━━━━━━━━━━━━☆━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━☆ ' + '\n' : ' ') +
                '[size=7][url=https://mycitygre.000webhostapp.com/Dio-Tools/index.html]Gatinho[/url] - (v' + '\u00a0' + version + ')' + '[/size]\n';
            var bb_count_str = parseInt(str.match(/\[/g).length, 10),
                bb_count_move = 0;
            var i = 0;
            str += move_table + '[center]' + '[img]' + imgArray.bordure2 + '[/img]' + '[/center]\n';
            $(textarea).val(text.substring(0, $(textarea).get(0).selectionStart) + str + text.substring($(textarea).get(0).selectionEnd));
        });
    }
    function getArrivalTime(duration_time) {
        var server_time = $('.server_time_area').get(0).innerHTML.split(" ")[0].split(":"),
            arrival_time, s, m, h;
        duration_time = duration_time.split(":");
        s = parseInt(server_time[2], 10) + parseInt(duration_time[2], 10);
        m = parseInt(server_time[1], 10) + parseInt(duration_time[1], 10) + ((s >= 60) ? 1 : 0);
        h = parseInt(server_time[0], 10) + parseInt(duration_time[0], 10) + ((m >= 60) ? 1 : 0);
        s = s % 60;
        m = m % 60;
        h = h % 24;
        s = ((s < 10) ? "0" : "") + s;
        m = ((m < 10) ? "0" : "") + m;
        h = ((h < 10) ? "0" : "") + h;
        arrival_time = h + ":" + m + ":" + s;
        return arrival_time;
    }
    ///////////////////////////////////
   //         * Smiley box *        //
  ///////////////////////////////////
    var smileyArray = {};
    var SmileyBox = {
        loading_error: false,
        isHalloween: false,
        isXmas: false,
        isForum: $(".editor_textbox_container").get(0),
        activate: function() {
            $('<style id="io_smiley">' +
                '.smiley_button { cursor:pointer; margin:3px 2px 2px 2px; } ' +
                '.smiley_box.game { z-index:5000; position:absolute; top:27px; left:430px; min-width:300px; display:none; } ' +
                '.smiley_box .box_header { display: table; width: 100%; text-align:center; } ' +
                '.smiley_box .group { display:table-cell; color: #0c450c; cursor: pointer; font-weight:bold; padding: 0px 2px 0px 2px; } ' +
                '.smiley_box .group.active { color: #089421; text-decoration:underline;} ' +
                '.smiley_box .group:hover { color: #14999E; } ' +
                '.smiley_box .halloween { color: #E25E00; } ' +
                '.smiley_box .xmas { color: darkred; } ' +
                '.smiley_box hr { margin:3px 0px 0px 0px; color:#086b18; border:1px solid; } ' +
                '.smiley_box .box_content { overflow: hidden; } ' +
                '.smiley_box .box_content .smiley { border: 1px solid rgba(0,0,0,0); border-radius: 5px;} ' +
                '.smiley_box .box_content .smiley:hover { background: rgba(8, 148, 77, 0.2); border: 1px solid rgba(0, 128, 0, 0.5); } ' +
                '.smiley_box .box_footer { text-align:center; margin-top:4px; } ' +
                '.smiley_box a:link, .smiley_box a:visited { color: #086b18; font-size: 0.7em; } ' +
                '.smiley_box a:hover { color: #14999E; } ' +
                '.smiley_box.forum .box_header_left { float:left; } ' +
                '.smiley_box.forum .box_header_right { text-align:right; margin-top:2px; } ' +
                '.smiley_box.forum { max-height:90px; margin-left:5px; width:99%; min-height:10px; } ' +
                '.smiley_box.forum .box_content { overflow:overlay; min-height:70px; margin-bottom:10px; } ' +
                '.smiley_box.forum a:link, .smiley_box.forum a:visited { font-size: 1em; } ' +
                '</style>').appendTo('head');
            smileyArray.button = ["zsSbQlY", "MJJRR3I"];
            smileyArray.standard = [
                "DPei3Qp", "bF0eB0f", "UKoHx8d", "U2tkUnL", "ZGd6diZ", "zsPaXt8", "b4yMHCR", "hMXNOWf", "zv3BwBY", "qb8pitw", "SbMOcW9", "6FAaoBZ", "qIxx6MK", "PB3b8gF", "c8q9rca",
                "3jYy90T", "kLr9s0f", "YJHTAE3", "biciJ8C", "rYRsXXg", "n3FYkXU", "xfAbFHj", "XXMqg0h", "t7Rmp6H", "jBPovq6", "ap2aCHN", "Yg6IQsU", "ahNHR4q", "Zd2EmoR", "XI4NzYy",
                "Q9mCXUA", "mCZqjVB", "1jq12ek", "FbOZeIT", "bTcfr5e", "CpaHDIz", "F3qc6rd", "bDfT0tg", "TrF7R27", "gAtIHDX", "ORz3hPI", "HjxgBNH", "Ke622SY", "DUmEAis", "nilUSGI",
                "DdWESJH", "SVbNcMj", "zsSbQlY"
            ];
            smileyArray.nature = [
                "ohF80Xh", "uSBMeNK", "RDLkTaL", "WYy009k", "ovXz1uF", "IsvfrKb", "XuIZsyv", "J7UBiHZ", "kkGD3VR", "GmuuKEN", "jV2LK91", "70U1h0t", "zL5Aejg", "BXr6Q5v", "t53lPer",
                "7O7lSBC", "p4VCjdR", "wlOSSsN"
            ];
            smileyArray.grepolis = [
                "fZlUp0N", "gd5KESZ", "oeM5qth", "TUQzCP4", "LeA4Ywj", "jQImYnY", "AuNco88", "Bp9YqV5", "UD9cFTA", "i6NxVsa", "AeeeaJd", "tyf31v4", "ogmI6xR", "27BdyyZ", "dXEfuay",
                "Iah41x6", "4sC6ypq", "k5tnTFX", "2w3xZnz"
            ];
            smileyArray.people = [
                "xam1czK", "jig6mb1", "8E9tmXZ", "kh5ZSjY", "jl1l2EM", "d66slf6", "kti8sMR", "qw6SfrS", "fHJQxBQ", "HbGVwzf", "SWWVtvs", "j80JznB", "agRMZr7", "RWTxZt6", "hJrGgj6",
                "dieq8l3", "8uyQnbf", "AwgIDYk", "QrnZ0kA", "W6HFnLK", "Dj9dCsw", "217iVNd", "ipuVM4p", "r6lyOhH"
            ];
            smileyArray.other = [
                "4kRPS1f", "CgPRFmo", "NAtQbc4", "RLkN8xn", "IenGma7", "qekISGD", "ykY09Fd", "YrHKsUo", "vtZqZUn", "mHXgbnJ", "4jY59S4", "WvUzkuD", "d6Uz1H3", "tamusb1",
                "obFEVLg", "DQmiXXH", "ug6DJci", "1mLTse7", "uLOlIy0", "bvenLlJ", "k5qBXhz", "oC9SKIW", "Y5Mq9r6", "TtyT9WV"
            ];
            SmileyBox.checkHolidaySeason();
            if (SmileyBox.isHalloween) {
                smileyArray.halloween = [
                    "VmUq8YQ", "BTBrwML", "dNCP0wM", "B5oN849", "TLiAEFi", "UJnqc0G", "VaC8Je2", "5Xcy172", "JzGjJ4p",
                    "bdE0Yxo", "PpwcMd9", "z94jDSX", "sCP77Lz", "RwFTzrA", "6pvxCNu",
                    "wKdEtyR", "pZN4ES7", "71PYXFd", "io9pHR8", "LIUOceU", "vD3WcoB",
                    "NKk2nZn", "L7ui742", "6TFMFF8", "1UjYUEz", "U4rAv8q", "F9PlIJc"
                ];
            }
            if (SmileyBox.isXmas) {
                smileyArray.xmas = [
                    "sEE7HDE", "peRt6rM", "AwDYw0i", "R8tIvWC", "WBmN73c", "TX3d7hg", "9TYlWvy",
                    "x5mkY7V", "3Ff8qi4", "Z4No2MO", "4NAvKYo", "AkUQnlL", "4iGLcQv", "kDeIIKr", "5ecbWoq", "2qynpev", "xr2CrOA", "JAyCMUi"
                ];
            }
            if (SmileyBox.isForum) {
                smileyArray.grepolis.push("pVAK8KH");
                smileyArray.grepolis.push("2w3xZnz");
                smileyArray.grepolis.push("fZlUp0N");
            }
            SmileyBox.loadSmileys();
        },
        deactivate: function() {
            $('#flask_smiley').remove();
        },
        checkHolidaySeason: function() {
            var daystamp = 1000 * 60 * 60 * 24,
                today = new Date((new Date()) % (daystamp * (365 + 1 / 4))), // without year
                halloween_start = daystamp * 297,
                halloween_end = daystamp * 321,
                xmas_start = daystamp * 334,
                xmas_end = daystamp * 361;
            SmileyBox.isHalloween = (today >= halloween_start) ? (today <= halloween_end) : false;
            SmileyBox.isXmas = (today >= xmas_start) ? (today <= xmas_end) : false;
        },
        loadSmileys: function() {
            if (LID !== "de") {
                smileyArray.other[17] = "VaC8Je2";
                smileyArray.other[19] = "F9PlIJc";
            }
            for (var e in smileyArray) {
                if (smileyArray.hasOwnProperty(e)) {
                    for (var f in smileyArray[e]) {
                        if (smileyArray[e].hasOwnProperty(f)) {
                            var src = smileyArray[e][f];
                            smileyArray[e][f] = new Image();
                            smileyArray[e][f].className = "smiley";
                            if (src.substring(0, 2) == "i/") {
                                smileyArray[e][f].src = "https://i.imgur.com/" + src + ".gif";
                            } else {
                                if (SmileyBox.loading_error == false) {
                                    smileyArray[e][f].src = "https://i.imgur.com/" + src + ".gif";
                                } else {
                                    smileyArray[e][f].src = 'https://i.imgur.com/MJJRR3I.gif';
                                }
                            }
                            smileyArray[e][f].onerror = function() {
                                this.src = 'https://i.imgur.com/MJJRR3I.gif';
                            };
                        }
                    }
                }
            }
        },
        changeForumEditorLayout: function() {
            $('.blockrow').css({
                border: "none"
            });
            $($('.section div label[for="title"]').parent()).css({
                float: "left",
                width: "36%",
                marginRight: "20px"
            });
            $($('.section div label[for="subject"]').parent()).css({
                float: "left",
                width: "36%",
                marginRight: "20px"
            });
            $('.section div input').eq(0).css({
                marginBottom: "-10px",
                marginTop: "10px"
            });
            $('#display_posticon').remove();
            $('.posticons table').css({
                width: "50%"
            });
            $('.posticons').css({
                marginBottom: "-16px"
            });
            $('.posticons').insertAfter($('.section div label[for="title"]').parent());
            $('.posticons').insertAfter($('.section div label[for="subject"]').parent());
            $('.posticons p').remove();
            $(".posticons [colspan='14']").parent().replaceWith($(".posticons [colspan='14']"));
            $(".posticons [colspan='14']").children().wrap("<nobr></nobr>");
            $(".posticons [colspan='14']").appendTo('.posticons tr:eq(0)');
            $(".posticons [colspan='4']").remove();
        },
        addForum: function() {
            $('<div class="smiley_box forum"><div>' +
                '<div class="box_header_left">' +
                '<span class="group standard active">' + getText("labels", "std") + '</span>' +
                '<span class="group grepolis">' + getText("labels", "gre") + '</span>' +
                '<span class="group nature">' + getText("labels", "nat") + '</span>' +
                '<span class="group people">' + getText("labels", "ppl") + '</span>' +
                '<span class="group other">' + getText("labels", "oth") + '</span>' +
                (SmileyBox.isHalloween ? '<span class="group halloween">' + getText("labels", "hal") + '</span>' : '') +
                (SmileyBox.isXmas ? '<span class="group xmas">' + getText("labels", "xma") + '</span>' : '') +
                '</div>' +
                '<div class="box_header_right"><a class="smiley_link" href="http://www.greensmilies.com/smilie-album/" target="_blank">WWW.GREENSMILIES.COM</a></div>' +
                '<hr>' +
                '<div class="box_content" style="overflow: hidden;"><hr></div>' +
                '</div></div><br>').insertAfter(".texteditor");
            SmileyBox.addSmileys("standard", "");
            $('.group').click(function() {
                $('.group.active').removeClass("active");
                $(this).addClass("active");
                SmileyBox.addSmileys(this.className.split(" ")[1], "");
            });
        },
        add: function(e) {
            var bbcodeBarId = "";
            switch (e) {
                case "/alliance_forum/forum":
                    bbcodeBarId = "#forum";
                    break;
                case "/message/forward":
                    bbcodeBarId = "#message_bbcodes";
                    break;
                case "/message/new":
                    bbcodeBarId = "#message_bbcodes";
                    break;
                case "/message/view":
                    bbcodeBarId = "#message_bbcodes";
                    break;
                case "/player_memo/load_memo_content":
                    bbcodeBarId = "#memo_edit";
                    break;
                case "/frontend_bridge/fetch":
                    bbcodeBarId = ".notes_container";
                    break;
            }
            if (($(bbcodeBarId + ' #emots_popup_7').get(0) || $(bbcodeBarId + ' #emots_popup_15').get(0)) && PID == 84367) {
                $(bbcodeBarId + " .bb_button_wrapper").get(0).lastChild.remove();
            }
            $('<img class="smiley_button" src="https://i.imgur.com/MJJRR3I.gif">').appendTo(bbcodeBarId + ' .bb_button_wrapper');
            $('<div class="smiley_box game">' +
                '<div class="bbcode_box middle_center"><div class="bbcode_box middle_right"></div><div class="bbcode_box middle_left"></div>' +
                '<div class="bbcode_box top_left"></div><div class="bbcode_box top_right"></div><div class="bbcode_box top_center"></div>' +
                '<div class="bbcode_box bottom_center"></div><div class="bbcode_box bottom_right"></div><div class="bbcode_box bottom_left"></div>' +
                '<div class="box_header">' +
                '<span class="group standard active">' + getText("labels", "std") + '</span>' +
                '<span class="group grepolis">' + getText("labels", "gre") + '</span>' +
                '<span class="group nature">' + getText("labels", "nat") + '</span>' +
                '<span class="group people">' + getText("labels", "ppl") + '</span>' +
                '<span class="group ' + (SmileyBox.isHalloween ? 'halloween' : (SmileyBox.isXmas ? 'xmas' : 'other')) + '">' + getText("labels", (SmileyBox.isHalloween ? 'hal' : (SmileyBox.isXmas ? 'xma' : 'oth'))) + '</span>' +
                '</div>' +
                '<hr>' +
                '<div class="box_content"></div>' +
                '<hr>' +
                '<div class="box_footer"><a href="http://www.greensmilies.com/smilie-album/" target="_blank">WWW.GREENSMILIES.COM</a></div>' +
                '</div>').appendTo(bbcodeBarId + ' .bb_button_wrapper');
            $(bbcodeBarId + ' .group').click(function() {
                $('.group.active').removeClass("active");
                $(this).addClass("active");
                SmileyBox.addSmileys(this.className.split(" ")[1], "#" + $(this).closest('.bb_button_wrapper').parent().get(0).id);
            });
            SmileyBox.addSmileys("standard", bbcodeBarId);
            $(bbcodeBarId + " .smiley_button").toggleClick(
                function() {
                    this.src = smileyArray.button[0].src;
                    $(this).closest('.bb_button_wrapper').find(".smiley_box").get(0).style.display = "block";
                },
                function() {
                    this.src = smileyArray.button[1].src;
                    $(this).closest('.bb_button_wrapper').find(".smiley_box").get(0).style.display = "none";
                }
            );
        },
        addSmileys: function(type, bbcodeBarId) {
            if ($(bbcodeBarId + " .box_content").get(0)) {
                $(bbcodeBarId + " .box_content").get(0).innerHTML = '';
            }
            for (var e in smileyArray[type]) {
                if (smileyArray[type].hasOwnProperty(e)) {
                    $(smileyArray[type][e]).clone().appendTo(bbcodeBarId + " .box_content");
                }
            }
            $('.smiley').css({
                margin: '0px',
                padding: '2px',
                maxHeight: '35px',
                cursor: 'pointer'
            });
            $(bbcodeBarId + " .box_content .smiley").click(function() {
                var textarea;
                if (uw.location.pathname.indexOf("game") >= 0) {
                    x
                    $(this).closest('.bb_button_wrapper').find(".smiley_button").click();
                    textarea = $(this).closest('.gpwindow_content').find("textarea").get(0);
                } else {
                    if ($('.editor_textbox_container').get(0)) {
                        textarea = $('.editor_textbox_container .cke_contents textarea').get(0);
                    } else {
                        $(this).appendTo('iframe .forum');
                    }
                }
                var text = $(textarea).val();
                $(textarea).val(text.substring(0, $(textarea).get(0).selectionStart) + "[img]" + this.src + "[/img]" + text.substring($(textarea).get(0).selectionEnd));
            });
        }
    };
    ///////////////////////////////////
   //      * Biremes counter *      //
  ///////////////////////////////////
    var BiremeCounter = {
        activate: function() {
            $(".picomap_container").prepend("<div id='available_units'><div id='bi_count'></div></div>");
            $('.picomap_overlayer').tooltip(getText("options", "bir")[0]);
            BiremeCounter.update();
            $('<style id="joe_bireme_counter">' +
                '#available_units { background: url(http://wiki.en.grepolis.com/images/4/44/Bireme_40x40.png); height:90px;' + //https://gpall.innogamescdn.com/images/game/units/units_sprite_90x90_compressed.jpg
                'width:90px; position: relative; margin: 5px 28px 0px 28px; background-position: -270px 0px; } ' +
                '#bi_count { color:#826021; position:relative; top:28px; font-style:italic; width:79px; } ' +
                '#sea_id { background: none; font-size:25px; cursor:default; height:50px; width:50px; position:absolute; top:70px; left:157px; z-index: 30; } ' +
                '</style>').appendTo('head');
            $('#sea_id').prependTo('#ui_box');
        },
        deactivate: function() {
            $('#available_units').remove();
            $('#joe_bireme_counter').remove();
            $('#sea_id').appendTo('.picomap_container');
        },
        save: function() {
            saveValue(WID + "_biremes", JSON.stringify(biriArray));
        },
        update: function() {
            var sum = 0,
                e;
            if ($('#bi_count').get(0)) {
                for (e in biriArray) {
                    if (biriArray.hasOwnProperty(e)) {
                        if (!uw.ITowns.getTown(e)) {
                            delete biriArray[e];
                            BiremeCounter.save();
                        } else {
                            sum += parseInt(biriArray[e], 10);
                        }
                    }
                }
                sum = sum.toString();
                var str = "",
                    fsize = ['1.4em', '1.2em', '1.15em', '1.1em', '1.0em'],
                    i;
                for (i = 0; i < sum.length; i++) {
                    str += "<span style='font-size:" + fsize[i] + "'>" + sum[i] + "</span>";
                }
                $('#bi_count').get(0).innerHTML = "<b>" + str + "</b>";
            }
        },
        get: function() {
            var biremeIn = parseInt(uw.ITowns.getTown(uw.Game.townId).units().bireme, 10),
                biremeOut = parseInt(uw.ITowns.getTown(uw.Game.townId).unitsOuter().bireme, 10);
            if (isNaN(biremeIn)) biremeIn = 0;
            if (isNaN(biremeOut)) biremeOut = 0;
            if (!biriArray[uw.Game.townId] || biriArray[uw.Game.townId] < (biremeIn + biremeOut)) {
                biriArray[uw.Game.townId] = biremeIn;
            }
            BiremeCounter.update();
            BiremeCounter.save();
        },
        getDocks: function() {
            var windowID = uw.BuildingWindowFactory.getWnd().getID(),
                biremeTotal = parseInt($('#gpwnd_' + windowID + ' #unit_order_tab_bireme .unit_order_total').get(0).innerHTML, 10);
            if (!isNaN(biremeTotal)) biriArray[uw.Game.townId] = biremeTotal;
            BiremeCounter.update();
            BiremeCounter.save();
        },
        getAgora: function() {
            var biremeTotal = parseInt(uw.ITowns.getTown(parseInt(uw.Game.townId, 10)).units().bireme, 10);
            if (isNaN(biremeTotal)) biremeTotal = 0;
            $('#units_beyond_list .bireme').each(function() {
                biremeTotal += parseInt(this.children[0].innerHTML, 10);
            });
            biriArray[uw.Game.townId] = biremeTotal;
            BiremeCounter.update();
            BiremeCounter.save();
        }
    };
    ///////////////////////////////////
   //        * Favor Popup *        //
  ///////////////////////////////////
    var FavorPopup = {
        godArray: {
            zeus: 'zeus',
            athena: 'athena',
            poseidon: 'poseidon',
            hera: 'hera',
            hades: 'hades',
            artemis: 'artemis',
            aphrodite: 'aphrodite',
            ares: 'ares',
        },
        activate: function() {
            $('.gods_area').bind('mouseover', function() {
                FavorPopup.setFavorPopup();
            });
            $('<div id="joe_FavorPopup" style="width: 80px; height: 35px; position: absolute !important; left: 75px; top: 2px;"></div>').appendTo('.gods_favor_amount');
            $('<div id="joe_FavorPopup2" style="width: 80px; height: 70px; position: absolute !important; left: 20px; top: -65px;"></div>').appendTo('.gods_favor_amount');
            $('<div id="joe_FuryPopup" class="fury_amount" style="width: 60px; height: 31px; position: absolute; right: 100px; top: 2px;"></div>').appendTo('.gods_favor_amount');
        },
        deactivate: function() {
            $('.gods_area').unbind('mouseover');
            $('#joe_FavorPopup').remove();
            $('#joe_FavorPopup2').remove();
            $('#joe_FuryPopup').remove();
            $('#joe-amount').remove();
        },
        setFavorPopup: function() {
            var pic_row = "",
                fav_row = "",
                prod_row = "",
                tooltip_str, textColor;
            for (var g in FavorPopup.godArray) {
                if (FavorPopup.godArray.hasOwnProperty(g)) {
                    if (uw.ITowns.player_gods.attributes.temples_for_gods[g]) {
                        pic_row += '<td><div style="transform:scale(0.8); margin: -6px;"; class="god_mini ' + [g] + '";></td>';
                        textColor = ((uw.ITowns.player_gods.attributes[g + "_favor"]) == uw.ITowns.player_gods.attributes.max_favor) ? textColor = "color:red;" : textColor = "color:blue";
                        fav_row += '<td class="bold" style="' + textColor + '">' + uw.ITowns.player_gods.attributes[g + "_favor"] + '</td>';
                        prod_row += '<td class="bold">' + uw.ITowns.player_gods.attributes.production_overview[g].production + '</td>';
                    }
                }
            }
            var fury_row = ""
            var fury_max = uw.ITowns.player_gods.attributes.max_fury
            textColor = ((uw.ITowns.player_gods.attributes.fury) == fury_max) ? textColor = "color:red;" : textColor = "color:darkgreen";
            fury_row = '<td class="bold" style="' + textColor + '">' + uw.ITowns.player_gods.attributes.fury + '/' + fury_max + '</td>';
            tooltip_str = $('<table><tr><td><img src="https://i.imgur.com/f8WfWVa.gif" style="opacity: 0.30;"></td>' + pic_row + '</tr>' +
                '<tr align="center"><td><img src="https://gpall.innogamescdn.com/images/game/res/favor.png"></td>' + fav_row + '</tr>' +
                '<tr align="center"><td><img src="https://i.imgur.com/QPF7fWF.png"></td>' + prod_row + '</tr>' +
                '</table>');
            tooltip_fury = $('<div id"tooltip"><table><tr align="center"><td><img src="https://wiki.en.grepolis.com/images/thumb/a/ab/Fury_icon.png/30px-Fury_icon.png"></td>' + fury_row + '</tr>' +
                '</table></div>');
            $('#joe_FavorPopup').tooltip(tooltip_str);
            $('#joe_FavorPopup2').tooltip(tooltip_str);

            $('#joe_FuryPopup').tooltip(tooltip_fury);
        }
    };
    ///////////////////////////////////
   // * GUI Optimization Revision * //
  ///////////////////////////////////
    var Spellbox = {
        observe: function() {
            $.Observer(uw.GameEvents.ui.layout_gods_spells.rendered).subscribe('JOE_SPELLBOX_CHANGE_OPEN', function() {
                if (spellbox.show == false) {
                    spellbox.show = true;
                    saveValue("spellbox", JSON.stringify(spellbox));
                }
                Spellbox.change();
            });
            $.Observer(uw.GameEvents.ui.layout_gods_spells.state_changed).subscribe('JOE_SPELLBOX_CLOSE', function() {
                spellbox.show = false;
                saveValue("spellbox", JSON.stringify(spellbox));
            });
            if (typeof(RepConv) !== "undefined") {
                $.Observer(uw.GameEvents.ui.layout_gods_spells.rendered).unsubscribe('GRCRT_GRC_ui_layout_gods_spells_rendered');
                $.Observer(uw.GameEvents.ui.layout_gods_spells.rendered).subscribe('GRCRT_GRC_ui_layout_gods_spells_rendered', function() {
                    if (typeof(RepConv.models.PlayerGods) !== "undefined") {
                        RepConvTool.loadPower();
                    }
                });
            }
        },
        activate: function() {
            Spellbox.observe();
            Spellbox.change();
            $('<style id="joe_spellbox_style" type="text/css">' +
                '.gods_spells_menu .header .btn_close { top: 15px; } ' +
                '#ui_box .nui_right_box { overflow: visible; } ' +
                '#ui_box .bolt, #ui_box .earthquake, #ui_box .pest { display: none } ' +
                '#ui_box .god_container { float: left } ' +
                '#ui_box .god_container[data-god_id="zeus"], #ui_box .god_container[data-god_id="athena"] { float: none } ' +
                '#ui_box .powers_container { background: none !important } ' +
                '#ui_box .content .title { display: none !important } ' +
                '#ui_box .gods_spells_menu .left, #ui_box .gods_spells_menu .right, #ui_box .gods_spells_menu .top, #ui_box .gods_spells_menu .bottom { display: none } ' +
                '#ui_box .gods_area { height:150px } ' +
                '#ui_box .gods_spells_menu { width: 134px; position:absolute ; z-index:5500; padding:30px 0px 0px -4px } ' +
                '#ui_box .gods_spells_menu .content { background:url(https://gpall.innogamescdn.com/images/game/layout/power_tile.png) 1px 13px; overflow:auto; margin:0 0 0px 0px; border:3px inset rgb(16, 87, 19); border-radius:10px } ' +
                '#ui_box .nui_units_box { display:block; margin-top:-8px; position:relative} ' +
                '</style>').appendTo('head');
            $("#ui_box .gods_spells_menu").draggable({
                containment: "body",
                distance: 10,
                snap: "body, .gods_area, .nui_units_box, .ui_quickbar, .nui_main_menu, .minimized_windows_area, #island_quests_overview",
                opacity: 0.7,
                stop: function() {
                    spellbox.top = this.style.top;
                    spellbox.left = this.style.left;
                    saveValue("spellbox", JSON.stringify(spellbox));
                }
            });
            $("#ui_box .gods_spells_menu").before($('#ui_box .nui_units_box'));
            $('#ui_box .gods_spells_menu').css({
                left: spellbox.left,
                top: spellbox.top
            });
            if (spellbox.show && !$('#ui_box .btn_gods_spells').hasClass('active')) {
                $('#ui_box .btn_gods_spells').click();
            }
        },
        deactivate: function() {
            $('#ui_box .gods_spells_menu').draggable('destroy');
            $('#ui_box .gods_spells_menu').css({
                left: "auto",
                top: "150px",
            });
            $('#joe_spellbox_style').remove();
            $.Observer(GameEvents.ui.layout_gods_spells.rendered).unsubscribe('JOE_SPELLBOX_CHANGE_OPEN');
            $.Observer(GameEvents.ui.layout_gods_spells.state_changed).unsubscribe('JOE_SPELLBOX_CLOSE');
        },
        change: function() {
            $('#ui_box .god_container[data-god_id="athena"]').appendTo('#ui_box .gods_spells_menu .content');
            $('#ui_box .god_container[data-god_id="artemis"]').appendTo('#ui_box .gods_spells_menu .content');
        }
    };
    function minimizeDailyReward() {
        if (MutationObserver) {
            var startup = new MutationObserver(function(mutations) {
                mutations.forEach(function(mutation) {
                    if (mutation.addedNodes[0]) {
                        if ($('.daily_login').get(0)) {
                            $('.daily_login').find(".minimize").click();
                        }
                    }
                });
            });
            startup.observe($('body').get(0), {
                attributes: false,
                childList: true,
                characterData: false
            });
            setTimeout(function() {
                startup.disconnect();
            }, 3000);
        }
    }
    var Taskbar = {
        activate: function() {
            $('.minimized_windows_area').get(0).style.width = "200%";
            $('.minimized_windows_area').get(0).style.left = "-125%";
        },
        deactivate: function() {
            $('.minimized_windows_area').get(0).style.width = "1550%";
            $('.minimized_windows_area').get(0).style.left = "912%"; //cote gauche 10px=62.5%
        }
    };
    function hideNavElements() {
        if (Game.premium_features.curator <= Timestamp.now()) {
            $('.nav').each(function() {
                this.style.display = "none";
            });
        }
    }
    ///////////////////////////////////
   //            * Chat *           //
  ///////////////////////////////////
    var Chat = {
        user_colors: {},
        delay: 10000,
        timestamp: 0,
        isWindowFocused: true,
        isActivated: false,
        isOpened: false,
        activate: function() {
            Chat.isActivated = true;
            Chat.isOpened = true;
            $('<style id="joe_chat_style">' +
                '#joe_chat { position: absolute; bottom: 0px; z-index: 4; width: 25%; transition: left 1.3s; left:0; -moz-user-select: text; -webkit-user-select: text; user-select: text; }' +
                '#joe_chat.resize { transition: left 0s; }' +
                '#joe_chat .slider { width:100%; height: 6px; top:0; right:1px;  position:absolute; margin-left:-8px; cursor: row-resize; }' +
                '#joe_chat .messagebox { text-shadow: 1px 1px 4px black; overflow-y:hidden; overflow-x:auto; max-height:120px; min-height:30px; width:100%; background: rgba(0, 0, 0, 0.6); color: #aaa; padding: 8px; text-align:left; font-size:11px; border: 1px solid darkgreen; border-left:none; border-bottom:1px solid #575; box-shadow: -3px 2px 3px black; }' +
                '#joe_chat .messagebox .time { float:left; color: #686; }' +
                '#joe_chat .messagebox .user { float:left; }' +
                '#joe_chat .messagebox .text { word-break: break-word; color: #797; }' +
                '#joe_chat .messagebox .welcome .text { color: rgb(200,220,200); }' +
                '#joe_chat .togglebutton { background: rgba(0,0,0,0.5); width: 24px; height: 100%; position: absolute; top: 0; right: -40px; color: #fc6; opacity:0.75; cursor: pointer; }' +
                '#joe_chat .togglebutton .top { height:4px; width:24px; background: url(https://felix.de/images/game/button_sprite_vertical.png) 0px -1px; position:absolute;}' +
                '#joe_chat .togglebutton:hover .top { background-position: -25px -1px; }' +
                '#joe_chat .togglebutton .bottom { height:4px; width:24px; background: url(https://felix.de/images/game/button_sprite_vertical.png) 0px 4px; position:absolute; bottom:0px; }' +
                '#joe_chat .togglebutton:hover .bottom { background-position: -25px 4px; }' +
                '#joe_chat .togglebutton .middle { height:100%; width:24px; background: url(https://felix.de/images/game/button_sprite_vertical.png) -50px 0px; }' +
                '#joe_chat .togglebutton:hover .middle { background-position: -75px 0px; }' +
                '#joe_chat .togglebutton .arrow { position:absolute; left:6px; top:42.5%; }' +
                '#joe_chat .icon { position:absolute; right:10px; top:10px; opacity:0.15; width: 31px; height:31px; filter: sepia(0.5); background: url(https://i.imgur.com/cILbyDs.png) -50px -76px no-repeat; }' +
                '#joe_chat input { background: rgba(0, 0, 0, 0.5); color: white; border: 0px none; padding: 8px; width: 100%; border-right: 1px solid darkgreen; }' +
                '#joe_chat input:hover { background: rgba(0, 0, 10, 0.4); }' +
                '#joe_chat input:focus { background: rgba(0, 0, 10, 0.4); }' +
                '#joe_chat input::placeholder, ' +
                '#joe_chat input::-webkit-input-placeholder, ' +
                '#joe_chat input::-moz-placeholder, ' +
                '#joe_chat input:-ms-input-placeholder, ' +
                '#joe_chat input:-moz-placeholder { color: black; }' +
                '.nui_main_menu ul { height:auto !important; }' +
                '.nui_main_menu li.chat { display:none !important; }' +
                '#grcgrc { display:none }' +
                '</style>').appendTo('head');
            $('<div id="joe_chat"><div class="icon"></div><div class="messagebox"><div class="slider"></div></div><input type="text" placeholder="Nachricht eingeben..." /></div>').appendTo("#ui_box");
            $('<div class="welcome"><div class="time">' + Chat.formatTime(Timestamp.server()) + ':&nbsp;</div><div class="text">Hallo ' + Game.player_name + '! Willkommen im Gatinho Weltenchat (' + Game.world_id + ')</div></div>').appendTo("#ui_box .messagebox");
            $('<div class="togglebutton"><div class="top"></div><div class="middle"><div class="arrow">👈</div></div><div class="bottom"></div></div>').appendTo("#joe_chat");
            $('#joe_chat input').keypress(function(e) {
                if (e.keyCode === 13) {
                    var _time = $('.server_time_area').get(0).innerHTML.split(" ")[0];
                    var _message = $(this).val();
                    if (_message.length > 0) {
                        Chat.sendMessage(_message);
                        $(this).val('');
                    }
                }
            });
            $('#joe_chat .togglebutton').toggleClick(
                function() {
                    var x = -($(window).width() * 0.25 + 16);
                    $('#joe_chat').css("left", x);
                    setTimeout(function() {
                        $('#joe_chat .togglebutton .arrow').get(0).innerHTML = "👉";
                    }, 1300);
                    $('#joe_chat .togglebutton').tooltip("Chat öffnen");
                },
                function() {
                    $('#joe_chat').css("left", 0);
                    setTimeout(function() {
                        $('#joe_chat .togglebutton .arrow').get(0).innerHTML = "👈";
                    }, 1300);
                    $('#joe_chat .togglebutton').tooltip("Chat schließen");
                }
            );
            $(window).on("resize.joe", function() {
                if ($('#joe_chat').css("left") !== "0px") {
                    var x = -($(window).width() * 0.25 + 16);
                    $('#joe_chat').addClass("resize");
                    $('#joe_chat').css("left", x);
                    setTimeout(function() {
                        $('#joe_chat').removeClass("resize");
                    }, 0);
                }
            });
            $('#joe_chat .togglebutton').tooltip("Chat schließen");
            $('#joe_chat .slider').mousedown(function(e) {
                e.preventDefault();
                $('#joe_chat .messagebox').css("max-height", "none");
                $(document).on("mousemove.joe", function(e) {
                    e.preventDefault();
                    var x = $(window).height() - e.pageY - 49;
                    if (x > 30 && x < $(window).height() - 400) {
                        $('#joe_chat .messagebox').css("height", x);
                    }
                });
            });
            $(document).on("mouseup.joe", function(e) {
                $(document).off("mousemove.joe");
                $('#joe_chat .messagebox')[0].scrollTop = $('#joe_chat .messagebox')[0].scrollHeight
            });
            Chat.timestamp = Timestamp.server();
            Chat.getMessages();
            $('#joe_chat').hover(function() {
                if (Chat.isOpened === true) {
                    Chat.delay = 3000;
                    clearTimeout(Chat.timeout_A);
                    clearTimeout(Chat.timeout_B);
                }
            }, function() {
                if (Chat.isOpened === true) {
                    Chat.delay = 10000;
                    Chat.timeout_A = setTimeout(function() {
                        Chat.delay = 30000;
                    }, 300000);
                    Chat.timeout_B = setTimeout(function() {
                        Chat.delay = 60000;
                    }, 900000);
                }
            });
            $(window).on("focus.joe", function() {
                Chat.isWindowFocused = true;
                if (Chat.isOpened === true) {
                    Chat.getMessages();
                    Chat.delay = 10000;
                    clearTimeout(Chat.timeout_A);
                    clearTimeout(Chat.timeout_B);
                    Chat.timeout_A = setTimeout(function() {
                        Chat.delay = 30000;
                    }, 300000);
                    Chat.timeout_B = setTimeout(function() {
                        Chat.delay = 60000;
                    }, 900000);
                }
            }).on("blur.joe", function() {
                Chat.isWindowFocused = false;
            });
        },
        deactivate: function() {
            Chat.isActivated = false;
            $('#joe_chat_style').remove();
            $('#joe_chat').remove();
            $(document).off('mouseup.joe');
            $(window).off('focus.joe');
            $(window).off('blur.joe');
            $(window).off('resize.joe');
        },
        sendMessage: function(_message) {
            _message = encodeURIComponent(_message.replace(/'/g, "&apos;").replace(/ /g, "&nbsp;"));
            $.ajax({
                type: "GET",
                url: "https://felix.de/php/sendMessage.php?world=" + Game.world_id + "&time=" + Timestamp.server() + "&player=" + Game.player_name + "&message=" + _message,
                dataType: 'text',
                success: function(response) {
                    console.debug("Nachricht wurde erfolgreich gesendet");
                    $('#joe_chat .messagebox')[0].scrollTop = $('#joe_chat .messagebox')[0].scrollHeight
                    Chat.getMessages();
                },
                error: function(e) {
                    console.debug("Nachricht konnte nicht gesendet werden", e);
                }
            });
        },
        getMessages: function() {
            if (Chat.isActivated === true) {
                var _currentTimestamp = Timestamp.server();
                var _url = "https://felix.de/php/getMessages.php?world=" + Game.world_id;
                if (typeof(Chat.lastID) !== "undefined") {
                    _url += "&id=" + Chat.lastID;
                } else {
                    _url += "&time=" + Chat.timestamp;
                }
                clearTimeout(Chat.timeout);
                if (Chat.isWindowFocused) {
                    $.ajax({
                        type: "GET",
                        url: _url,
                        dataType: 'json',
                        success: function(_messages) {
                            if (Chat.isActivated === true) {
                                Chat.timestamp = _currentTimestamp;
                                for (var m in _messages) {
                                    if (_messages.hasOwnProperty(m)) {
                                        if (typeof(_messages[m].last_id) === "undefined") {
                                            var _message = _messages[m].message.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/&apos;/g, "\'");
                                            $('#joe_chat .messagebox').append(
                                                '<div class="time">' + Chat.formatTime(_messages[m].time) + ':&nbsp;</div>' +
                                                '<div class="user" style="color:' + Chat.getUserColor(_messages[m].player) + '">' + _messages[m].player + ':&nbsp;</div>' +
                                                '<div class="text"> ' + _message + ' </div>'
                                            );
                                        } else {
                                            Chat.lastID = _messages[m].last_id;
                                        }
                                    }
                                }
                                clearTimeout(Chat.timeout);

                                Chat.timeout = setTimeout(function() {

                                    if (Chat.isWindowFocused) {
                                        Chat.getMessages();
                                    }
                                }, Chat.delay);
                                $('#joe_chat .messagebox')[0].scrollTop = $('#joe_chat .messagebox')[0].scrollHeight
                            }
                        },
                        error: function(xhr) {
                            console.debug("Nachrichten konnten nicht geladen werden", xhr);
                            clearTimeout(Chat.timeout);
                            Chat.timeout = setTimeout(function() {
                                Chat.getMessages();
                            }, Chat.delay);
                        }
                    });
                }
            }
        },
        getUserColor: function(_user) {
            if (typeof(Chat.user_colors[_user]) === "undefined") {
                var r = Math.floor(Math.random() * 255);
                var g = Math.floor(Math.random() * 255);
                var b = Math.floor(Math.random() * 255);
                if (r + g < 200 && r < 130 && g < 130) {
                    return Chat.getUserColor(_user);
                }
                Chat.user_colors[_user] = 'rgb(' + r + ',' + g + ',' + b + ')';
            }
            return Chat.user_colors[_user];
        },
        formatTime: function(_timestamp) {
            var date = new Date(_timestamp * 1000);
            var hours = "0" + date.getHours();
            var minutes = "0" + date.getMinutes();
            var seconds = "0" + date.getSeconds();
            return hours.substr(-2) + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
        }
    };
    ///////////////////////////////////
   //      * Activity boxes *       //
  ///////////////////////////////////
    var mut_toolbar, mut_command, mut_trade;
    var save_command_mouseout,
        save_commandlist_mouseout,
        save_trade_mouseout,
        save_tradelist_mouseout,
        save_command_mouseover,
        save_trade_mouseover;
    var ActivityBoxes = {
        activate: function() {
            ActivityBoxes.checkToolbarAtStart();
            $('#toolbar_activity_commands_list').css({
                left: commandbox.left + "px",
                top: commandbox.top + "px"
            });
            $('<style id="Freese_movements_style">' +
                '.gp_town_link { visibility: visible; }' +
                '#toolbar_activity_commands_list.fast { visibility: visible; display: block !important; }' +
                '.item.no_results { font-size: 12px; }' +
                '.button_new.square.remove { background-position: 0px 0; }' +
                '.sandy-box .item.command { visibility: visible; display: block !important; }' +
                '#toolbar_activity_commands_list.fast .remove { visibility: visible; }' +
                '.button_new.square.remove { background-position: -66px 0; }' +
                '</style>').appendTo('head');
            $('<style id="fix_lists" type="text/css">' +
                '#toolbar_activity_commands_list, #toolbar_activity_trades_list { width: auto}' +
                '.dropdown-list .content { max-height: 329px}' +
                '</style>' +
                '<style id="joe_fix_trade" type="text/css">' +
                '#toolbar_activity_trades_list {' +
                'left:' + tradebox.left + 'px !important;' +
                'top: ' + tradebox.top + 'px !important}' +
                '</style>').appendTo('head');
            ActivityBoxes.draggableTradeBox();
            ActivityBoxes.draggableCommandBox();
            ActivityBoxes.catchToolbarEvents();
        },
        deactivate: function() {
            ActivityBoxes.hideTradeList();
            ActivityBoxes.hideCommandList();
            mut_toolbar.disconnect();
            mut_command.disconnect();
            mut_trade.disconnect();
        },
        showTradeList: function() {
            if (!$('#joe_trades_activity_style').get(0)) {
                $('#toolbar_activity_trades').mouseover();
                $('<style id="joe_trades_activity_style"> #toolbar_activity_trades_list { display: block !important; } </style>').appendTo("head");
            }
        },
        showCommandList: function() {
            if (!$('#joe_commands_activity_style').get(0)) {
                $('#toolbar_activity_commands').mouseover();
                $('<style id="joe_commands_activity_style"> #toolbar_activity_commands_list { ' +
                    'display:block !important; left:' + commandbox.left + 'px; top:' + commandbox.top + 'px; }' +
                    '</style>').appendTo("head");
            }
        },
        hideTradeList: function() {
            if ($('#joe_trades_activity_style').get(0)) {
                $('#joe_trades_activity_style').remove();
                $('#toolbar_activity_trades').mouseout();
            }
        },
        hideCommandList: function() {
            if ($('#joe_commands_activity_style').get(0)) {
                $('#joe_commands_activity_style').remove();
                $('#toolbar_activity_commands').mouseout();
            }
        },
        activate2: function() {
            var observe_options = {
                attributes: false,
                childList: true,
                characterData: false
            };
            ActivityBoxes.catchToolbarEvents();
            mut_command.observe($('.toolbar_activities .commands .count').get(0), observe_options);
            mut_trade.observe($('.toolbar_activities .trades .count').get(0), observe_options);
            $('<style id="joe_activity_style"> ' +
                '#toolbar_activity_commands_list.active { display: block !important; } ' +
                '#toolbar_activity_trades_list.active { display: block !important; } ' +
                '</style>').appendTo("head");
            $('#toolbar_activity_commands').mouseover();
            $('#toolbar_activity_trades').mouseover();
            $('#toolbar_activity_commands, #toolbar_activity_trades').off("mouseover");
            $('#toolbar_activity_commands, #toolbar_activity_commands_list, #toolbar_activity_trades, #toolbar_activity_trades_list').off("mouseout");
            $('#toolbar_activity_trades_list').unbind("click");
            ActivityBoxes.checkToolbarAtStart();
            $('#toolbar_activity_commands_list').css({
                left: commandbox.left + "px",
                top: commandbox.top + "px"
            });
            $('<style id="fix_lists" type="text/css">' +
                '#toolbar_activity_commands_list, #toolbar_activity_trades_list { width: 160px}' +
                '.dropdown-list .content { max-height: 329px}' +
                '</style>' +
                '<style id="joe_fix_trade" type="text/css">' +
                '#toolbar_activity_trades_list {' +
                'left:' + tradebox.left + 'px !important;' +
                'top: ' + tradebox.top + 'px !important}' +
                '</style>').appendTo('head');
            ActivityBoxes.draggableCommandBox();
            ActivityBoxes.draggableTradeBox();
        },
        deactivate2: function() {
            mut_toolbar.disconnect();
            mut_command.disconnect();
            mut_trade.disconnect();
            $('#toolbar_activity_commands').mouseover = save_command_mouseover;
            $('#toolbar_activity_trades').mouseover = save_trade_mouseover;
            $('#toolbar_activity_commands').mouseout = save_command_mouseout;
            $('#toolbar_activity_commands_list').mouseout = save_commandlist_mouseout;
            $('#toolbar_activity_trades').mouseout = save_trade_mouseout;
            $('#toolbar_activity_trades_list').mouseout = save_tradelist_mouseout;
            $('#toolbar_activity_trades_list').removeClass("active");
            $('#toolbar_activity_commands_list').removeClass("active");
            $('#joe_activity_style').remove();
        },
        deactivate: function() {
            $('#Freese_movements_style').remove();
        },
        checkToolbarAtStart: function() {
            if (parseInt($('.toolbar_activities .commands .count').get(0).innerHTML, 10) > 0) {
                ActivityBoxes.showCommandList();
            } else {
                ActivityBoxes.hideCommandList();
            }
            if (parseInt($('.toolbar_activities .trades .count').get(0).innerHTML, 10) > 0) {
                ActivityBoxes.showTradeList();
            } else {
                ActivityBoxes.hideTradeList();
            }
        },
        catchToolbarEvents: function() {
            var observe_options = {
                attributes: false,
                childList: true,
                characterData: false
            };
            mut_toolbar = new MutationObserver(function(mutations) {
                mutations.forEach(function(mutation) {
                    if (mutation.addedNodes[0]) {
                        if (mutation.target.id === "toolbar_activity_trades_list") {
                            ActivityBoxes.draggableTradeBox();
                        } else {
                            ActivityBoxes.draggableCommandBox();
                        }
                        mutation.addedNodes[0].remove();
                    }
                });
            });
            mut_command = new MutationObserver(function(mutations) {
                mutations.forEach(function(mutation) {
                    if (mutation.addedNodes[0]) {
                        if (mutation.addedNodes[0].nodeValue > 0) {
                            ActivityBoxes.showCommandList();
                        } else {
                            ActivityBoxes.hideCommandList();
                        }
                    }
                });
            });
            mut_trade = new MutationObserver(function(mutations) {
                mutations.forEach(function(mutation) {
                    if (mutation.addedNodes[0]) {
                        if (mutation.addedNodes[0].nodeValue > 0) {
                            ActivityBoxes.showTradeList();
                        } else {
                            ActivityBoxes.hideTradeList();
                        }
                    }
                });
            });
            mut_command.observe($('.toolbar_activities .commands .count').get(0), observe_options);
            mut_trade.observe($('.toolbar_activities .trades .count').get(0), observe_options);
        },
        draggableTradeBox: function() {
            $("#toolbar_activity_trades_list").draggable({
                containment: "body",
                distance: 20,
                snap: "body, .gods_area, .nui_units_box, .ui_quickbar, .nui_main_menu, .minimized_windows_area, .nui_left_box",
                opacity: 0.7,
                start: function() {
                    $("#joe_fix_trade").remove();
                },
                stop: function() {
                    var pos = $('#toolbar_activity_trades_list').position();
                    tradebox.left = pos.left;
                    tradebox.top = pos.top;
                    saveValue("tradebox", JSON.stringify(tradebox));
                    $('<style id="joe_fix_trade" type="text/css">' +
                        '#toolbar_activity_trades_list { left:' + tradebox.left + 'px !important; top:' + tradebox.top + 'px !important; } ' +
                        '</style>').appendTo('head');
                }
            });
        },
        draggableCommandBox: function() {
            $("#toolbar_activity_commands_list").draggable({
                containment: "body",
                distance: 20,
                snap: "body, .gods_area, .nui_units_box, .ui_quickbar, .nui_main_menu, .minimized_windows_area, .nui_left_box",
                opacity: 0.7,
                stop: function() {
                    var pos = $('#toolbar_activity_commands_list').position();
                    commandbox.left = pos.left;
                    commandbox.top = pos.top;
                    saveValue("commandbox", JSON.stringify(commandbox));
                }
            });
        }
    };
    ///////////////////////////////////
   //   * Scrollbar Style color *   //
  ///////////////////////////////////
    var Scrollbar = {
        activate: function() {
            $('#joe_Scrollbar_display_none').remove();
            $('<style id="joe_Scrollbar_display">' +
                '#scrollbar { display:block!important; } ' +
                '</style>').appendTo('head');
            if (DATA.options.joe_ta || DATA.options.joe_tb || DATA.options.joe_tc || DATA.options.joe_td || DATA.options.joe_te || DATA.options.joe_tf || DATA.options.joe_tg || DATA.options.joe_th || DATA.options.joe_ti || DATA.options.joe_tj) {
                //Blue
                if (DATA.options.joe_ta) {
                    $('<style id="joe_Scrollbar">.bbcode_box.bottom_center,.bbcode_box.bottom_left,.bbcode_box.bottom_right,.bbcode_box.middle_left,.bbcode_box.middle_right,.bbcode_box.top_center,.bbcode_box.top_left,.bbcode_box.top_right,.gp_window.classic_sub_window>.border_b,.gp_window.classic_sub_window>.border_l,.gp_window.classic_sub_window>.border_r,.gp_window.classic_sub_window>.border_t,.grepolis_score .summary .card_background,.sandy-box .border_b,.sandy-box .border_l,.sandy-box .border_r,.sandy-box .border_t,.sandy-box .corner_bl,.sandy-box .corner_br,.sandy-box .corner_tl,.sandy-box .corner_tr,.sandy-box .middle,.tooltip_with_arrow .twa_background_fake,.tooltip_with_arrow .twa_border_bottom,.tooltip_with_arrow .twa_border_left,.tooltip_with_arrow .twa_border_right,.tooltip_with_arrow .twa_border_top,.tooltip_with_arrow .twa_corner_bl,.tooltip_with_arrow .twa_corner_br,.tooltip_with_arrow .twa_corner_tl,.tooltip_with_arrow .twa_corner_tr,.tooltip_with_arrow.arrow-right-bottom .twa_arrow,.tooltip_with_arrow.arrow-right-middle .twa_arrow,.tooltip_with_arrow.arrow-right-top .twa_arrow{filter:grayscale(50%) hue-rotate(10deg)}.published_report .espionage_report,.published_report .power_report{background:#ecf2fc}div.game_border{background-color:#869eff}#trade_tab .content{background:url(https://i.imgur.com/BCUgYDS.gif) #bcc6ff;}.tooltip_reward_day .reward_wrapper{background:url() #bcc6ff}#unit_order_confirm:hover,a#unit_order_max:hover,a#unit_order_min:hover,a.left:hover,a.right:hover,a.unit_order_show:hover{box-shadow:-1px -1px 10px #00ff34}[ng-app=bot][new][ng-controller=commander]{background:repeating-linear-gradient(45deg,#908df9 0,#8d8afb 10%,#a098fc 0,#afadf9 50%) 0/15px 15px;text-shadow:0 0 10px #fff,0 0 20px #fff,0 0 30px #fff,0 0 40px #228DFF,0 0 70px #228DFF,0 0 80px #228DFF,0 0 100px #228DFF,0 0 150px #228DFF;outline:hsla(245.1,100%,81.4%,.93) solid 5px}[ng-app=bot][new][ng-controller=heraldController] .attacks .attack,button{background-color:#bcc6ff}[ng-app=bot][new] button:nth-child(n+2){margin-left:0}.botSettings{background-color:#8ba2fb}.botSettings .control{border-bottom:solid 2px #869eff}.botSettings .control:hover{background-color:#bcc6ff}.queue2{background-color:#8ba2fb}[ng-app=bot][new][ng-controller=commanderOrdersController] .orders .order{background-color:#bcc6ff}[ng-app=bot][new].window{background:#8ba2fb}.bbcode_box.middle_center{background:url() #bcc6ff}.bb_ally_chooser_ally_input.ac_input,.bb_player_chooser_player_input.ac_input,.bb_town_chooser_town_input.ac_input{background-color:#ecf2fc}#notification_area div.description{background-color:rgba(249,112,195,.68)}.farm_towns.lvl_0 .actions .action_wrapper{background:url() #bcc6ff}#ranking_search_info,.ac_odd,.farm_towns.lvl_0 .actions .action_wrapper .bpv_trade_illustration{background:url() #869eff}.ac_even{background:url() #bcc6ff}.ac_over{background-color:#94adf6}#notification_area div.notification{background-color:rgba(0,0,0,0)}#notification_area div.notification.incoming_attack div.icon{background-color:rgba(255,130,130,.5)}#notification_area div.notification.incoming_support div.icon{background-color:rgba(134,255,130,.5)}#notification_area div.notification.resourcetransport div.icon{background-color:rgba(250,233,212,.5)}#notification_area div.notification.newreport div.icon{background-color:rgba(255,255,130,.5)}#notification_area div.notification.newaward div.icon{background-color:rgba(224,139,255,.39)}#notification_area div.notification.awmessage div.icon,#notification_area div.notification.newmessage div.icon{background-color:rgba(57,106,252,.5)}.content.js-dropdown-item-list,.grepolis_score .score_content li.award_group:nth-child(2n+1),.item.trade.option.even{background-color:#bcc6ff}.grepolis_score .score_content li.award_group:nth-child(2n){background-color:#869eff}.shadow_box .content_background{background-color:#143a50;opacity:.7}.classic_window.heroes_train .heroes_train .middle_border{background:#bcc6ff}.classic_window.heroes_train .heroes_train .inner_border{background:#869eff}.dropdown-list.default{background-color:#bcc6ff}#message_report_affront_dialog{background:#bcc6ff}#affront_input,#affront_player{background:url() #869eff}.advisor_hint,div.island_info_towns ul{background:url() #bcc6ff}.captain_commercial .message{background-color:#bcc6ff}.gp_window.classic_sub_window>.background{background:url() #869eff}.temple_gods_large{background-image:url(https://i.imgur.com/xUroKua.png)}.god_selection #temple_gods{background:url(https://i.imgur.com/xUroKua.png) -995px 0 no-repeat}.content.js-dropdown-item-list.instant_buy{background-color:#bcc6ff}#ph_trader_image,.daily_login_wrapper,.ph_order_info,.textarea .middle{filter:grayscale(50%)}div.quote div.quote_message{background-color:#ecf2fc}.game_inner_box .game_body2{background:url() #869eff}.attack_planner .bar_top,.attack_planner .details_container,.attack_planner.attacks .attacks_list,.background_default{background:url() #bcc6ff}.attack_planner .town_box .town_name_box,.attack_planner .units_box td{background-color:#eef3fe}.attack_planner.show_plan .attacks_list li.selected{background-color:#869eff}.attack_planner li.selected{background:url(https://gppt.innogamescdn.com/images/game/unit_overview/arrow_right.png) left no-repeat #869eff}#joe_town_popup .god_content,#joe_town_popup .hero_content,#joe_town_popup .resources_content,#joe_town_popup .spy_content,#joe_town_popup .unit_content{background:#8ba2fb}.popup_middle_middle{background:url() #869eff}.popup_table_inside,.town_infos{background-color:#bcc6ff}.popup_bottom_middle,.popup_middle_left,.popup_middle_right,.popup_top_middle{filter:grayscale(50%) hue-rotate(10deg)}.classic_window .filler,div.gpwindow_content{background:url() #8ba2fb}.color_highlight,.item_selected{background-color:#7b96fff0}#buildings .building{filter:grayscale(50%)}.box.bottom.left,.box.bottom.right,.box.top.left,.box.top.right,.classic_window .corner_bl,.classic_window .corner_br,.classic_window .corner_tl,.classic_window .corner_tr,.classic_window .wnd_border_b,.classic_window .wnd_border_l,.classic_window .wnd_border_r,.classic_window .wnd_border_t,.special_buildings_image{filter:grayscale(50%) hue-rotate(10deg)}.game_table_odd{background:#bcc6ff}.game_table{background:url()}.game_list .odd{background-image:url();background-color:#869eff}.odd{background:url() #869eff}.game_list .even{background-image:url();background-color:#bcc6ff}.even{background:url()}.game_list_footer{background:url() #869eff}#folder_toggle_menu,.game_body{background:url() #bcc6ff}#message_message,#message_new_message,.notes .window_content .notes_container textarea{background-color:#ecf2fc}.forum_toggle,.notes .window_content .notes_container .preview_box{background:url() #869eff}.forum_toggle{position:relative}#thread_functions{background:url() #bcc6ff}.forum_toggle #toggle{background:url() #8ba2fb}textarea{background-color:#ecf2fc}#newthread,#newthread #bbcodes{background:url()}#forum_admin .forum.odd .name .text_box,#poll_wrapper,#post_save_wrapper{background:url() #bcc6ff}#forum_admin .forum.even .name .text_box{background:url() #869eff}.box.middle.center{background:#869eff}.colA0A0FF{background:#c4f4f4}#trade_selected,.box.middle.center div.box_content,div.overview_search_bar{background:#869eff}.trade_town_wrapper{filter:grayscale(50%) hue-rotate(950deg)}.celebration_name.bold,.textbox .middle,.town_info_input,span.grepo_input select{filter:grayscale(50%)}#recruit_overview .cell_casted_powers{background-color:#869eff}#outer_troops_box .outer_troops_sort_box{background:url() #869eff}#building_overview tr td.locked{background-color:#88a4fe}.building_overview #building_overview td.building.hover,.building_overview #building_overview tr:hover{background:#fbfcd2}#building_overview td.locked.hover,#building_overview td.locked:hover{background-color:#ffc4c4}#culture_overview_towns div.celebration_button,#culture_overview_towns div.celebration_icon,#culture_overview_towns div.celebration_icon_bg,#culture_overview_towns div.celebration_name,#culture_overview_towns div.celebration_progressbar,#culture_overview_towns div.celebration_progressbar div,#hides_overview_towns div.help_button,#hides_overview_towns div.hide_icon,#hides_overview_towns div.hide_icon_bg,#hides_overview_towns div.hide_progressbar,#hides_overview_towns div.hide_progressbar div,#hides_overview_towns div.iron_name{filter:grayscale(30%)}#active_town_list_head,#all_town_list_head,#premium_exchange,#town_group_active_towns,#town_group_all_towns,#unit_order div.unit_order_tab,.advisors_container .advisors_box .advisor_box .extension_box,.farm_town .action_wrapper .trading_wrapper,.farm_towns .actions .action_wrapper .action_card,.farm_towns .actions .resources::after,.farm_towns .actions .trade::after,.farm_towns .actions .units::after,.gp_tab .gp_pc_left,.gp_tab .gp_pc_middle,.gp_tab .gp_pc_right,.marketplace.create_offer .section.market_offer,.marketplace.own_offers #town_filter,.spinner .body,.spinner .border_l,.spinner .border_r,.spinner .button_down,.spinner .button_up,.ui_construction_queue .construction_queue_frame .queue_BG_slice-middle{filter:grayscale(50%)}#townsoverview .game_list li:hover{background-image:url();background-color:#869eff}.message_post_content{background:url() #869eff}#ally_announce_bbcodes,#message_partner,.message_post{background:url() #bcc6ff}.published_report .report_units_overview{background:#ecf2fc}.published_report_header{background-color:#cad0ff}#island_towns_controls{background:url(h) #bcc6ff}#fto_town_list{background:url() #bcc6ff}#fto_town_list li.fto_town.active,div.fto_time_checkbox.active{background:#869eff}#fto_town_list li.fto_island,.questlog_index .quest.selected,.table_box .table_box_content .body{background:url() #bcc6ff}.brown{background:#869eff}#ally_finder_text tr:first-child{background-color:#b2dcfa}#ally_announce_textarea,#ally_profile_textarea{background-color:#ecf2fc}#ally_flags .game_body{background-image:url()}.reservation_tool .gp_tab_page,table.present_data tr.even{background:url() #bcc6ff}table.present_data tr.odd{background:url() #869eff}#ally_pact_list{background-color:#869eff}#mines_values tr.even,#premium_overview_inner{background:url() #bcc6ff}#mines_values tr.odd{background:url() #869eff}.background_light{background:url() #bcc6ff}#mines_text{background-image:url();background-color:#bcc6ff}#ally_profile_info #ally_pacts,#ally_profile_info #ally_profile,#ally_towns .members_list li.header{background:url() #bcc6ff}#ally_towns .members_list{background:url() #869eff}#premium_exchange .premium_exchange_rules .expand_text,#premium_exchange .premium_exchange_rules .rules{background:url() #bcc6ff}.marketplace.all_offers tr:nth-child(2n):not(.premium_exchange),.marketplace.own_offers tr:nth-child(2n):not(.premium_exchange){background:url() #869eff}.marketplace.all_offers table,.marketplace.own_offers table{background:url() #bcc6ff}.unit.unit_order_unit_image.unit_icon50x50:hover{-webkit-border-radius:20px;transform:scaleX(1.1);padding:2px;filter:hue-rotate(-50deg);box-shadow:3px 8px 30px #00dbff}.curtain_box .cb_bg{background-color:#bcc6ff}.attack_spots .attacking_units .cb_bg,.attack_spots .attacking_units .curtain_box .cb_bg,.attack_spots .defending_units .cb_bg{background:url()}.hide_window_wrapper .hide_window_background{filter:blur(90px) grayscale(100%)}#place_culture_bg,.place_simulator_even,.place_simulator_even2,.place_simulator_odd,.place_simulator_odd2,span.grepo_input input{filter:grayscale(50%)}.god_selection .background{filter:blur(90px) grayscale(100%)}.report_units_overview{background:url() #bcc6ff}.report_booty_bonus_fight{background:url() #869eff}#folder_menu_reports{background:url() #e5f7b5}.dropdown.blue_arrow .border-left,.dropdown.blue_arrow .border-right,.dropdown.blue_arrow .caption,.dropdown.default .border-left,.dropdown.default .border-right,.dropdown.default .caption{filter:grayscale(50%)}.academy .academy_image{filter:blur(90px) grayscale(100%)}.construction_queue_sprite,.various_orders_queue .various_orders_middle{filter:grayscale(50%)}.docks.window_background,.main_window_background{filter:blur(90px) grayscale(100%)}#unit_order_unit_info td,#unit_order_values td{background:#f2e8d2}#unit_order_ph_background{filter:grayscale(50%)}#towninfo_description{background:#bcc6ff}.town_cast_spell_oldcontent { background: #bcc6ff !important;}.ironer_window_background,.window_storage_wrapper .storage_window_background{filter:blur(90px) grayscale(100%)}.storage_resbar{filter:grayscale(50%)}.barracks.window_background,.farm_window_background,.lumber_window_background,.marketplace .marketplace_window_background,.place_window_background,.stoner_window_background,.wall_window_background{filter:blur(90px) grayscale(100%)}.game_inner_box .game_footer{background-image:url();background-color:#869eff}.academy .tech_tree_box .column{border-left:2px groove #d6b468;background:url()}.academy .tech_tree_box .column.inactive{background-image:url();background-color:#c3d1cd}a.submenu_link .left,a.submenu_link .middle,a.submenu_link .right{filter:grayscale(20%) hue-rotate(1deg)}div.gpwindow_bottom,div.gpwindow_left,div.gpwindow_right,div.gpwindow_top{filter:grayscale(50%) hue-rotate(10deg)}.academy .research_points_box{filter:grayscale(50%)}#custom_map_color_background{background:url() no-repeat #bcc6ff}#awards_visibility_all,#awards_visibility_ally,#awards_visibility_player{background:url() repeat-y #bcc6ff}.olympus_temple_info .temple_actions_wrapper,.olympus_temple_info .temple_info_wrapper .owner,.olympus_temple_info .temple_info_wrapper .troops_movements{background-image:url();background-color:#bcc6ff}.olympus_temple_info .temple_info_wrapper .troops_support .unit_slots .empty{background-image:url();background-color:#dbdafcf0}.olympus_temple_info .temple_info_wrapper .troops_support .unit_slots .empty:nth-child(2n){background-image:url();background-color:#bcc6ff}.olympus_temple_info .temple_defense_wrapper li{background:url();background-color:#dbdafcf0}.olympus_temple_info .temple_defense_wrapper li:nth-child(2n+1){background:url() #bcc6ff}.olympus_temple_info .temple_powers_overlay{background-color:#c7c5fc}div.quote div.quote_author{background-color:#869eff}#report_date{background-color:#cad0ff}.button:hover{box-shadow:0 0 3px rgb(1 197 33)} </style>').appendTo("head")
                }
                //Red
                if (DATA.options.joe_tb) {
                    $('<style id="joe_Scrollbar">.bbcode_box.bottom_center,.bbcode_box.bottom_left,.bbcode_box.bottom_right,.bbcode_box.middle_left,.bbcode_box.middle_right,.bbcode_box.top_center,.bbcode_box.top_left,.bbcode_box.top_right,.gp_window.classic_sub_window>.border_b,.gp_window.classic_sub_window>.border_l,.gp_window.classic_sub_window>.border_r,.gp_window.classic_sub_window>.border_t,.grepolis_score .summary .card_background,.sandy-box .border_b,.sandy-box .border_l,.sandy-box .border_r,.sandy-box .border_t,.sandy-box .corner_bl,.sandy-box .corner_br,.sandy-box .corner_tl,.sandy-box .corner_tr,.sandy-box .middle,.tooltip_with_arrow .twa_background_fake,.tooltip_with_arrow .twa_border_bottom,.tooltip_with_arrow .twa_border_left,.tooltip_with_arrow .twa_border_right,.tooltip_with_arrow .twa_border_top,.tooltip_with_arrow .twa_corner_bl,.tooltip_with_arrow .twa_corner_br,.tooltip_with_arrow .twa_corner_tl,.tooltip_with_arrow .twa_corner_tr,.tooltip_with_arrow.arrow-right-bottom .twa_arrow,.tooltip_with_arrow.arrow-right-middle .twa_arrow,.tooltip_with_arrow.arrow-right-top .twa_arrow{filter:grayscale(50%) hue-rotate(10deg)}#trade_tab .content{background:url(https://i.imgur.com/BCUgYDS.gif) #ffdbdb;}.bbcode_box.middle_center,.tooltip_reward_day .reward_wrapper{background:url() #ffdbdb}.bb_ally_chooser_ally_input.ac_input,.bb_player_chooser_player_input.ac_input,.bb_town_chooser_town_input.ac_input{background-color:#effcec}#notification_area div.description{background-color:rgba(249,112,195,.68)}.farm_towns.lvl_0 .actions .action_wrapper{background:url() #ffdbdb}#ranking_search_info,.ac_odd,.farm_towns.lvl_0 .actions .action_wrapper .bpv_trade_illustration{background:url() #ffc2c2}.ac_even{background:url() #ffdbdb}.ac_over{background-color:#ffdbdb}#notification_area div.notification{background-color:rgba(0,0,0,0)}#notification_area div.notification.incoming_attack div.icon{background-color:rgba(255,130,130,.5)}#notification_area div.notification.incoming_support div.icon{background-color:rgba(134,255,130,.5)}#notification_area div.notification.resourcetransport div.icon{background-color:rgba(250,233,212,.5)}#notification_area div.notification.newreport div.icon{background-color:rgba(255,255,130,.5)}#notification_area div.notification.newaward div.icon{background-color:rgba(224,139,255,.39)}#notification_area div.notification.awmessage div.icon,#notification_area div.notification.newmessage div.icon{background-color:rgba(57,106,252,.5)}.content.js-dropdown-item-list,.grepolis_score .score_content li.award_group:nth-child(2n+1),.item.trade.option.even{background-color:#ffdbdb}.grepolis_score .score_content li.award_group:nth-child(2n){background-color:#ffc2c2}.shadow_box .content_background{background-color:#143a50;opacity:.7}.classic_window.heroes_train .heroes_train .middle_border{background:#ffdbdb}.classic_window.heroes_train .heroes_train .inner_border{background:#ffc2c2}.dropdown-list.default{background-color:#ffdbdb}#message_report_affront_dialog{background:#ffdbdb}#affront_input,#affront_player{background:url() #ffc2c2}.advisor_hint,div.island_info_towns ul{background:url() #ffdbdb}.captain_commercial .message{background-color:#ffdbdb}.gp_window.classic_sub_window>.background{background:url() #ffc2c2}.temple_gods_large{background-image:url(https://i.imgur.com/xUroKua.png)}.god_selection #temple_gods{background:url(https://i.imgur.com/xUroKua.png) -995px 0 no-repeat}.content.js-dropdown-item-list.instant_buy{background-color:#ffdbdb}#ph_trader_image,.daily_login_wrapper,.ph_order_info,.textarea .middle{filter:grayscale(50%)}div.quote div.quote_message{background-color:#effcec}.game_inner_box .game_body2{background:url() #ffc2c2}.attack_planner .bar_top,.attack_planner .details_container,.attack_planner.attacks .attacks_list,.background_default{background:url() #ffdbdb}.attack_planner .town_box .town_name_box,.attack_planner .units_box td{background-color:#eef3fe}.attack_planner.show_plan .attacks_list li.selected{background-color:#ffc2c2}.attack_planner li.selected{background:url(https://gppt.innogamescdn.com/images/game/unit_overview/arrow_right.png) left no-repeat #ffc2c2}#joe_town_popup .god_content,#joe_town_popup .hero_content,#joe_town_popup .resources_content,#joe_town_popup .spy_content,#joe_town_popup .unit_content{background:#ffc2c2}.popup_middle_middle{background:url() #ffc2c2}.popup_table_inside,.town_infos{background-color:#ffdbdb}.popup_bottom_middle,.popup_middle_left,.popup_middle_right,.popup_top_middle{filter:grayscale(50%) hue-rotate(10deg)}.classic_window .filler,div.gpwindow_content{background:url();background-color:#ff9696e8}#buildings .building{filter:grayscale(50%)}.box.bottom.left,.box.bottom.right,.box.top.left,.box.top.right,.classic_window .corner_bl,.classic_window .corner_br,.classic_window .corner_tl,.classic_window .corner_tr,.classic_window .wnd_border_b,.classic_window .wnd_border_l,.classic_window .wnd_border_r,.classic_window .wnd_border_t,.special_buildings_image,.trade_town_wrapper{filter:grayscale(50%) hue-rotate(10deg)}.color_highlight,.item_selected{background:0 0}.game_table_odd{background:#ffdbdb}.game_list .even,.game_list .odd{background-image:url()}.game_table{background:url()}.game_list .odd{background-color:#ffc2c2}.odd{background:url()}.game_list .even{background-color:#ffdbdb}.even,.forum_toggle #toggle{background:url()}.game_list_footer{background:url() #ffc2c2}#folder_toggle_menu,.game_body{background:url() #ffdbdb}#message_message,#message_new_message,.notes .window_content .notes_container textarea{background-color:#effcec}.forum_toggle,.notes .window_content .notes_container .preview_box{background:url() #ffc2c2}.forum_toggle{position:relative}#thread_functions{background:url() #ffdbdb}.forum_toggle #toggle{background-color:#ff9696e8}textarea{background-color:#effcec}#newthread,#newthread #bbcodes{background:url()}#forum_admin .forum.odd .name .text_box,#poll_wrapper,#post_save_wrapper{background:url() #ffdbdb}#forum_admin .forum.even .name .text_box,.box.middle.center{background:url() #ffc2c2}.colA0A0FF{background:#c4f4f4}#trade_selected,.box.middle.center div.box_content,div.overview_search_bar{background:#ffc2c2}.celebration_name.bold,.textbox .middle,.town_info_input,span.grepo_input select{filter:grayscale(50%)}#recruit_overview .cell_casted_powers{background-color:#ffc2c2}#outer_troops_box .outer_troops_sort_box{background:url() #ffc2c2}#building_overview tr td.locked{background-color:#fe88d0}.building_overview #building_overview td.building.hover,.building_overview #building_overview tr:hover{background:#fbfcd2}#building_overview td.locked.hover,#building_overview td.locked:hover{background-color:#ffc4c4}#culture_overview_towns div.celebration_button,#culture_overview_towns div.celebration_icon,#culture_overview_towns div.celebration_icon_bg,#culture_overview_towns div.celebration_name,#culture_overview_towns div.celebration_progressbar,#culture_overview_towns div.celebration_progressbar div,#hides_overview_towns div.help_button,#hides_overview_towns div.hide_icon,#hides_overview_towns div.hide_icon_bg,#hides_overview_towns div.hide_progressbar,#hides_overview_towns div.hide_progressbar div,#hides_overview_towns div.iron_name{filter:grayscale(30%)}#active_town_list_head,#all_town_list_head,#premium_exchange,#town_group_active_towns,#town_group_all_towns,#unit_order div.unit_order_tab,.advisors_container .advisors_box .advisor_box .extension_box,.farm_town .action_wrapper .trading_wrapper,.farm_towns .actions .action_wrapper .action_card,.farm_towns .actions .resources::after,.farm_towns .actions .trade::after,.farm_towns .actions .units::after,.gp_tab .gp_pc_left,.gp_tab .gp_pc_middle,.gp_tab .gp_pc_right,.marketplace.create_offer .section.market_offer,.marketplace.own_offers #town_filter,.spinner .body,.spinner .border_l,.spinner .border_r,.spinner .button_down,.spinner .button_up,.ui_construction_queue .construction_queue_frame .queue_BG_slice-middle{filter:grayscale(50%)}#townsoverview .game_list li:hover{background-image:url();background-color:#8cc5f7c9}.message_post_content{background:url() #ffc2c2}#ally_announce_bbcodes,#message_partner,.message_post{background:url() #ffdbdb}.published_report .espionage_report,.published_report .power_report,.published_report .report_units_overview{background:#effcec}.published_report_header{background-color:#cad0ff}#island_towns_controls{background:url(h) #ffdbdb}#fto_town_list{background:url() #ffdbdb}#fto_town_list li.fto_town.active,div.fto_time_checkbox.active{background:#ffc2c2}.brown {background:#ffc2c2}#ally_finder_text tr:first-child{background-color:#b2dcfa}#ally_announce_textarea,#ally_profile_textarea{background-color:#effcec}#ally_flags .game_body{background-image:url()}.reservation_tool .gp_tab_page,table.present_data tr.even{background:url() #ffdbdb}table.present_data tr.odd{background:url() #ffc2c2}#ally_pact_list{background-color:#ffc2c2}#mines_values tr.even,#premium_overview_inner{background:url() #ffdbdb}#mines_values tr.odd{background:url() #ffc2c2}.background_light{background:url() #ffdbdb}#mines_text{background-image:url();background-color:#ffdbdb}#ally_profile_info #ally_pacts,#ally_profile_info #ally_profile,#ally_towns .members_list li.header{background:url() #ffdbdb}#ally_towns .members_list{background:url() #ffc2c2}#premium_exchange .premium_exchange_rules .expand_text,#premium_exchange .premium_exchange_rules .rules{background:url() #ffdbdb}.marketplace.all_offers tr:nth-child(2n):not(.premium_exchange),.marketplace.own_offers tr:nth-child(2n):not(.premium_exchange){background:url() #ffc2c2}.marketplace.all_offers table,.marketplace.own_offers table{background:url() #ffdbdb}.unit.unit_order_unit_image.unit_icon50x50:hover{-webkit-border-radius:20px;transform:scaleX(1.1);padding:2px;filter:hue-rotate(-50deg)}.curtain_box .cb_bg{background-color:#ffdbdb}.attack_spots .attacking_units .cb_bg,.attack_spots .attacking_units .curtain_box .cb_bg,.attack_spots .defending_units .cb_bg{background:url()}.hide_window_wrapper .hide_window_background{filter:blur(90px) grayscale(100%)}#place_culture_bg,.place_simulator_even,.place_simulator_even2,.place_simulator_odd,.place_simulator_odd2,span.grepo_input input{filter:grayscale(50%)}.god_selection .background{filter:blur(90px) grayscale(100%)}.report_units_overview{background:url() #ffdbdb}.report_booty_bonus_fight{background:url() #ffc2c2}#folder_menu_reports{background:url() #e5f7b5}.dropdown.blue_arrow .border-left,.dropdown.blue_arrow .border-right,.dropdown.blue_arrow .caption,.dropdown.default .border-left,.dropdown.default .border-right,.dropdown.default .caption{filter:grayscale(50%)}.academy .academy_image{filter:blur(90px) grayscale(100%)}.construction_queue_sprite,.various_orders_queue .various_orders_middle{filter:grayscale(50%)}.docks.window_background,.main_window_background{filter:blur(90px) grayscale(100%)}#unit_order_unit_info td,#unit_order_values td{background:#f2e8d2}#unit_order_ph_background{filter:grayscale(50%)}#towninfo_description{background:#ffc2c2}.town_cast_spell_oldcontent { background: #ffc2c2 !important;}.ironer_window_background,.window_storage_wrapper .storage_window_background{filter:blur(90px) grayscale(100%)}.storage_resbar{filter:grayscale(50%)}.barracks.window_background,.farm_window_background,.lumber_window_background,.marketplace .marketplace_window_background,.place_window_background,.stoner_window_background,.wall_window_background{filter:blur(90px) grayscale(100%)}.game_inner_box .game_footer{background-image:url();background-color:#ffc2c2}.academy .tech_tree_box .column{border-left:2px groove #d6b468;background:url()}.academy .tech_tree_box .column.inactive{background-image:url();background-color:#c3d1cd}a.submenu_link .left,a.submenu_link .middle,a.submenu_link .right{filter:grayscale(20%) hue-rotate(5deg)}div.gpwindow_bottom,div.gpwindow_left,div.gpwindow_right,div.gpwindow_top{filter:grayscale(50%) hue-rotate(10deg)}.academy .research_points_box{filter:grayscale(50%)} </style>').appendTo("head");
                }
                //purple
                if (DATA.options.joe_tc) {
                    $('<style id="joe_Scrollbar">.bbcode_box.bottom_center,.bbcode_box.bottom_left,.bbcode_box.bottom_right,.bbcode_box.middle_left,.bbcode_box.middle_right,.bbcode_box.top_center,.bbcode_box.top_left,.bbcode_box.top_right,.gp_window.classic_sub_window>.border_b,.gp_window.classic_sub_window>.border_l,.gp_window.classic_sub_window>.border_r,.gp_window.classic_sub_window>.border_t,.grepolis_score .summary .card_background,.sandy-box .border_b,.sandy-box .border_l,.sandy-box .border_r,.sandy-box .border_t,.sandy-box .corner_bl,.sandy-box .corner_br,.sandy-box .corner_tl,.sandy-box .corner_tr,.sandy-box .middle,.tooltip_with_arrow .twa_background_fake,.tooltip_with_arrow .twa_border_bottom,.tooltip_with_arrow .twa_border_left,.tooltip_with_arrow .twa_border_right,.tooltip_with_arrow .twa_border_top,.tooltip_with_arrow .twa_corner_bl,.tooltip_with_arrow .twa_corner_br,.tooltip_with_arrow .twa_corner_tl,.tooltip_with_arrow .twa_corner_tr,.tooltip_with_arrow.arrow-right-bottom .twa_arrow,.tooltip_with_arrow.arrow-right-middle .twa_arrow,.tooltip_with_arrow.arrow-right-top .twa_arrow{filter:grayscale(50%) hue-rotate(10deg)} #premium_exchange .gold{background-color:#f9e369;border:.1875em solid #EECC12;box-shadow:1px 1px 15px #a300ff;border-radius:10px 100px/120px}.gp_tab .gp_page_caption.active .gp_pc_middle{color:#ff02b4}#premium_exchange .gold{background-position:0 0;background-image:url(https://www.icone-gif.com/gif/monnaie/billets/tresor_billet25.gif);background-repeat:no-repeat;width:42px;height:40px;margin-left:5px;background-size:50px}.fight_report_classic.conquest.published .report_units_overview{background:url() #cad0ff}.colA0A0FF{background:0 0}#joe_town_popup .god_content,#joe_town_popup .resources_content,#joe_town_popup .spy_content,#joe_town_popup .unit_content{background-color:#a1a7ff;border:1px solid #5585e1}.published_report .espionage_report,.published_report .power_report{background:#ecf2fc}div.game_border{background-color:#c4c2ff}.domination .domination_info .info_wrapper .domination_rule_wrapper .expand_text,.domination .domination_info .info_wrapper .domination_rule_wrapper .rules{background:url() #dcdbff}#trade_tab .content{background:url(https://i.imgur.com/BCUgYDS.gif) #dcdbff;}.tooltip_reward_day .reward_wrapper{background:url() #dcdbff}#unit_order_confirm:hover,a#unit_order_max:hover,a#unit_order_min:hover,a.left:hover,a.right:hover,a.unit_order_show:hover{box-shadow:-1px -1px 10px #00ff34}[ng-app=bot][new][ng-controller=commander]{background:repeating-linear-gradient(45deg,#908df9 0,#8d8afb 10%,#a098fc 0,#afadf9 50%) 0/15px 15px;text-shadow:0 0 10px #fff,0 0 20px #fff,0 0 30px #fff,0 0 40px #228DFF,0 0 70px #228DFF,0 0 80px #228DFF,0 0 100px #228DFF,0 0 150px #228DFF;outline:hsla(245.1,100%,81.4%,.93) solid 5px}[ng-app=bot][new][ng-controller=heraldController] .attacks .attack,button{background-color:#dcdbff}[ng-app=bot][new] button:nth-child(n+2){margin-left:0}.botSettings{background-color:#afadf0f0}.botSettings .control{border-bottom:solid 2px #c4c2ff}.botSettings .control:hover{background-color:#dcdbff}.queue2{background-color:#afadf0f0}[ng-app=bot][new][ng-controller=commanderOrdersController] .orders .order{background-color:#dcdbff}[ng-app=bot][new].window{background:0 0}.bbcode_box.middle_center{background:url() #dcdbff}.bb_ally_chooser_ally_input.ac_input,.bb_player_chooser_player_input.ac_input,.bb_town_chooser_town_input.ac_input{background-color:#ecf2fc}#notification_area div.description{background-color:rgba(249,112,195,.68)}.farm_towns.lvl_0 .actions .action_wrapper{background:url() #dcdbff}#ranking_search_info,.ac_odd,.farm_towns.lvl_0 .actions .action_wrapper .bpv_trade_illustration{background:url() #c4c2ff}.ac_even{background:url() #dcdbff}.ac_over{background-color:#9496f6}#notification_area div.notification{background-color:rgba(0,0,0,0)}#notification_area div.notification.incoming_attack div.icon{background-color:rgba(255,130,130,.5)}#notification_area div.notification.incoming_support div.icon{background-color:rgba(134,255,130,.5)}#notification_area div.notification.resourcetransport div.icon{background-color:rgba(250,233,212,.5)}#notification_area div.notification.newreport div.icon{background-color:rgba(255,255,130,.5)}#notification_area div.notification.newaward div.icon{background-color:rgba(224,139,255,.39)}#notification_area div.notification.awmessage div.icon,#notification_area div.notification.newmessage div.icon{background-color:rgba(57,106,252,.5)}.content.js-dropdown-item-list,.grepolis_score .score_content li.award_group:nth-child(2n+1),.item.trade.option.even{background-color:#dcdbff}.grepolis_score .score_content li.award_group:nth-child(2n){background-color:#c4c2ff}.shadow_box .content_background{background-color:#143a50;opacity:.7}.classic_window.heroes_train .heroes_train .middle_border{background:#dcdbff}.classic_window.heroes_train .heroes_train .inner_border{background:#c4c2ff}.dropdown-list.default{background-color:#dcdbff}#message_report_affront_dialog{background:#dcdbff}#affront_input,#affront_player{background:url() #c4c2ff}.advisor_hint,div.island_info_towns ul{background:url() #dcdbff}.captain_commercial .message{background-color:#dcdbff}.gp_window.classic_sub_window>.background{background:url() #c4c2ff}.god_selection #temple_gods,.temple_gods_large{background-image:url(https://i.imgur.com/xUroKua.png)}.content.js-dropdown-item-list.instant_buy{background-color:#dcdbff}#ph_trader_image,.daily_login_wrapper,.ph_order_info,.textarea .middle{filter:grayscale(50%)}div.quote div.quote_message{background-color:#ecf2fc}.game_inner_box .game_body2{background:url() #c4c2ff}.attack_planner .bar_top,.attack_planner .details_container,.attack_planner.attacks .attacks_list,.background_default{background:url() #dcdbff}.attack_planner .town_box .town_name_box,.attack_planner .units_box td{background-color:#eef3fe}.attack_planner.show_plan .attacks_list li.selected{background-color:#c4c2ff}.attack_planner li.selected{background:url(https://gppt.innogamescdn.com/images/game/unit_overview/arrow_right.png) left no-repeat #c4c2ff}.popup_middle_middle{background:url() #c4c2ff}.popup_table_inside,.town_infos{background-color:#dcdbff}.popup_bottom_middle,.popup_middle_left,.popup_middle_right,.popup_top_middle{filter:grayscale(50%) hue-rotate(10deg)}.classic_window .filler,div.gpwindow_content{background:url();background-color:#afadf0f0}.color_highlight,.item_selected{background-color:#ac7efff0}#buildings .building{filter:grayscale(50%)}.box.bottom.left,.box.bottom.right,.box.top.left,.box.top.right,.classic_window .corner_bl,.classic_window .corner_br,.classic_window .corner_tl,.classic_window .corner_tr,.classic_window .wnd_border_b,.classic_window .wnd_border_l,.classic_window .wnd_border_r,.classic_window .wnd_border_t,.special_buildings_image{filter:grayscale(50%) hue-rotate(10deg)}.game_table_odd{background:#dcdbff}.game_table{background:url()}.game_list .odd{background-image:url();background-color:#c4c2ff}.odd{background:url() #c4c2ff}.game_list .even{background-image:url();background-color:#dcdbff}.even,.forum_toggle #toggle{background:url()}.game_list_footer{background:url() #c4c2ff}#folder_toggle_menu,.game_body{background:url() #dcdbff}#message_message,#message_new_message,.notes .window_content .notes_container textarea{background-color:#ecf2fc}.forum_toggle,.notes .window_content .notes_container .preview_box{background:url() #c4c2ff}.forum_toggle{position:relative}#thread_functions{background:url() #dcdbff}.forum_toggle #toggle{background-color:#afadf0f0}textarea{background-color:#ecf2fc}#newthread,#newthread #bbcodes{background:url()}#forum_admin .forum.odd .name .text_box,#poll_wrapper,#post_save_wrapper{background:url() #dcdbff}#forum_admin .forum.even .name .text_box{background:url() #c4c2ff}#trade_selected,.box.middle.center,.box.middle.center div.box_content,div.overview_search_bar{background:#c4c2ff}.trade_town_wrapper{filter:grayscale(50%) hue-rotate(950deg)}.celebration_name.bold,.textbox .middle,.town_info_input,span.grepo_input select{filter:grayscale(50%)}#recruit_overview .cell_casted_powers{background-color:#c4c2ff}#outer_troops_box .outer_troops_sort_box{background:url() #c4c2ff}#building_overview tr td.locked{background-color:#888ffe}.building_overview #building_overview td.building.hover,.building_overview #building_overview tr:hover{background:#fbfcd2}#building_overview td.locked.hover,#building_overview td.locked:hover{background-color:#ffc4c4}#culture_overview_towns div.celebration_button,#culture_overview_towns div.celebration_icon,#culture_overview_towns div.celebration_icon_bg,#culture_overview_towns div.celebration_name,#culture_overview_towns div.celebration_progressbar,#culture_overview_towns div.celebration_progressbar div,#hides_overview_towns div.help_button,#hides_overview_towns div.hide_icon,#hides_overview_towns div.hide_icon_bg,#hides_overview_towns div.hide_progressbar,#hides_overview_towns div.hide_progressbar div,#hides_overview_towns div.iron_name{filter:grayscale(30%)}#active_town_list_head,#all_town_list_head,#premium_exchange,#town_group_active_towns,#town_group_all_towns,#unit_order div.unit_order_tab,.advisors_container .advisors_box .advisor_box .extension_box,.farm_town .action_wrapper .trading_wrapper,.farm_towns .actions .action_wrapper .action_card,.farm_towns .actions .resources::after,.farm_towns .actions .trade::after,.farm_towns .actions .units::after,.gp_tab .gp_pc_left,.gp_tab .gp_pc_middle,.gp_tab .gp_pc_right,.marketplace.create_offer .section.market_offer,.marketplace.own_offers #town_filter,.spinner .body,.spinner .border_l,.spinner .border_r,.spinner .button_down,.spinner .button_up,.ui_construction_queue .construction_queue_frame .queue_BG_slice-middle{filter:grayscale(50%)}#townsoverview .game_list li:hover{background-image:url();background-color:#c4c2ff}.message_post_content{background:url() #c4c2ff}#ally_announce_bbcodes,#message_partner,.message_post{background:url() #dcdbff}.published_report .report_units_overview{background:#ecf2fc}.published_report_header{background-color:#cad0ff}#island_towns_controls{background:url(h) #dcdbff}#fto_town_list{background:url() #dcdbff}#fto_town_list li.fto_town.active,div.fto_time_checkbox.active{background:#c4c2ff}#fto_town_list li.fto_island,.questlog_index .quest.selected,.table_box .table_box_content .body{background:url() #dcdbff}.brown{background:#c4c2ff}#ally_finder_text tr:first-child{background-color:#b2dcfa}#ally_announce_textarea,#ally_profile_textarea{background-color:#ecf2fc}#ally_flags .game_body{background-image:url()}.reservation_tool .gp_tab_page,table.present_data tr.even{background:url() #dcdbff}table.present_data tr.odd{background:url() #c4c2ff}#ally_pact_list{background-color:#c4c2ff}#mines_values tr.even,#premium_overview_inner{background:url() #dcdbff}#mines_values tr.odd{background:url() #c4c2ff}.background_light{background:url() #dcdbff}#mines_text{background-image:url();background-color:#dcdbff}#ally_profile_info #ally_pacts,#ally_profile_info #ally_profile,#ally_towns .members_list li.header{background:url() #dcdbff}#ally_towns .members_list{background:url() #c4c2ff}#premium_exchange .premium_exchange_rules .expand_text,#premium_exchange .premium_exchange_rules .rules{background:url() #dcdbff}.marketplace.all_offers tr:nth-child(2n):not(.premium_exchange),.marketplace.own_offers tr:nth-child(2n):not(.premium_exchange){background:url() #c4c2ff}.marketplace.all_offers table,.marketplace.own_offers table{background:url() #dcdbff}.unit.unit_order_unit_image.unit_icon50x50:hover{-webkit-border-radius:20px;transform:scaleX(1.1);padding:2px;filter:hue-rotate(-50deg);box-shadow:3px 8px 30px #00dbff}.curtain_box .cb_bg{background-color:#dcdbff}.attack_spots .attacking_units .cb_bg,.attack_spots .attacking_units .curtain_box .cb_bg,.attack_spots .defending_units .cb_bg{background:url()}.hide_window_wrapper .hide_window_background{filter:blur(90px) grayscale(100%)}#place_culture_bg,.place_simulator_even,.place_simulator_even2,.place_simulator_odd,.place_simulator_odd2,span.grepo_input input{filter:grayscale(50%)}.god_selection .background{filter:blur(90px) grayscale(100%)}.report_units_overview{background:url() #dcdbff}.report_booty_bonus_fight{background:url() #c4c2ff}#folder_menu_reports{background:url() #e5f7b5}.dropdown.blue_arrow .border-left,.dropdown.blue_arrow .border-right,.dropdown.blue_arrow .caption,.dropdown.default .border-left,.dropdown.default .border-right,.dropdown.default .caption{filter:grayscale(50%)}.academy .academy_image{filter:blur(90px) grayscale(100%)}.construction_queue_sprite,.various_orders_queue .various_orders_middle{filter:grayscale(50%)}.docks.window_background,.main_window_background{filter:blur(90px) grayscale(100%)}#unit_order_unit_info td,#unit_order_values td{background:#f2e8d2}#unit_order_ph_background{filter:grayscale(50%)}#towninfo_description{background:#dcdbff}.town_cast_spell_oldcontent { background: #dcdbff !important;}.ironer_window_background,.window_storage_wrapper .storage_window_background{filter:blur(90px) grayscale(100%)}.storage_resbar{filter:grayscale(50%)}.barracks.window_background,.farm_window_background,.lumber_window_background,.marketplace .marketplace_window_background,.place_window_background,.stoner_window_background,.wall_window_background{filter:blur(90px) grayscale(100%)}.game_inner_box .game_footer{background-image:url();background-color:#c4c2ff}.academy .tech_tree_box .column{border-left:2px groove #d6b468;background:url()}.academy .tech_tree_box .column.inactive{background-image:url();background-color:#c3d1cd}a.submenu_link .left,a.submenu_link .middle,a.submenu_link .right{filter:grayscale(20%) hue-rotate(1deg)}div.gpwindow_bottom,div.gpwindow_left,div.gpwindow_right,div.gpwindow_top{filter:grayscale(50%) hue-rotate(10deg)}.academy .research_points_box{filter:grayscale(50%)}#custom_map_color_background{background:url() no-repeat #dcdbff}#awards_visibility_all,#awards_visibility_ally,#awards_visibility_player{background:url() repeat-y #dcdbff}.olympus_temple_info .temple_actions_wrapper,.olympus_temple_info .temple_info_wrapper .owner,.olympus_temple_info .temple_info_wrapper .troops_movements{background-image:url();background-color:#dcdbff}.olympus_temple_info .temple_info_wrapper .troops_support .unit_slots .empty{background-image:url();background-color:#dbdafcf0}.olympus_temple_info .temple_info_wrapper .troops_support .unit_slots .empty:nth-child(2n){background-image:url();background-color:#dcdbff}.olympus_temple_info .temple_defense_wrapper li{background:url();background-color:#dbdafcf0}.olympus_temple_info .temple_defense_wrapper li:nth-child(2n+1){background:url() #dcdbff} </style>').appendTo("head");
                }
                //yellow
                if (DATA.options.joe_td) {
                    $('<style id="joe_Scrollbar">.god_selection #temple_gods { background: url(https://i.imgur.com/xUroKua.png) no-repeat -995px 0; } .temple_gods_large { background-image: url(https://i.imgur.com/AQAHoVM.png); } a#unit_order_max:hover, a#unit_order_min:hover {  box-shadow: -1px -1px 10px #00ff34; } a.right:hover { box-shadow: -1px -1px 10px #00ff34; } a.left:hover { box-shadow: -1px -1px 10px #00ff34; } #unit_order_confirm:hover { box-shadow: -1px -1px 10px #00ff34; } a.unit_order_show:hover { box-shadow: -1px -1px 10px #00ff34; } .botSettings { background-color: #fff896e8; } .botSettings .control { border-bottom: solid 2px #faffc2; } .botSettings .control:hover { background-color: #fffedb; } .queue2 { background-color: #fff896e8; } [ng-app="bot"][new][ng-controller="commanderOrdersController"] .orders .order { background-color: #fffedb; } [ng-app="bot"][new].window { background: #fff896e8; } #trade_tab .content { background: #fffedb url(https://i.imgur.com/BCUgYDS.gif);} .tooltip_reward_day .reward_wrapper { background: url() ; background-color: #fffedb; } .bbcode_box.middle_center { background: url(); background-color: #fffedb; } .bbcode_box.top_left { filter: grayscale(50%) hue-rotate(10deg); } .bbcode_box.top_right { filter: grayscale(50%) hue-rotate(10deg); } .bbcode_box.top_center { filter: grayscale(50%) hue-rotate(10deg); } .bbcode_box.bottom_center { filter: grayscale(50%) hue-rotate(10deg); } .bbcode_box.bottom_right { filter: grayscale(50%) hue-rotate(10deg); } .bbcode_box.bottom_left { filter: grayscale(50%) hue-rotate(10deg); } .bbcode_box.middle_left { filter: grayscale(50%) hue-rotate(10deg); } .bbcode_box.middle_right { filter: grayscale(50%) hue-rotate(10deg); } .bb_player_chooser_player_input.ac_input { background-color: #effcec; } .bb_ally_chooser_ally_input.ac_input { background-color: #effcec; } .bb_town_chooser_town_input.ac_input { background-color: #effcec; } #notification_area div.description { background-color: rgba(249, 112, 195, 0.68); } .farm_towns.lvl_0 .actions .action_wrapper { background: url(); background-color: #fffedb; } .farm_towns.lvl_0 .actions .action_wrapper .bpv_trade_illustration { background: url(); background-color: #faffc2; } #ranking_search_info { background: transparent url(); background-color: #faffc2; } .ac_odd {background: url(); background-color: #faffc2; } .ac_even { background: url(); background-color: #fffedb;} .ac_over { background-color: #fffedb; } #notification_area div.notification { background-color: rgba(0, 0, 0, 0); } #notification_area div.notification.incoming_attack div.icon { background-color: rgba(255, 130, 130, 0.5); } #notification_area div.notification.incoming_support div.icon { background-color: rgba(134, 255, 130, 0.5); } #notification_area div.notification.resourcetransport div.icon { background-color: rgba(250, 233, 212, 0.5); } #notification_area div.notification.newreport div.icon { background-color: rgba(255, 255, 130, 0.5); } #notification_area div.notification.newaward div.icon {  background-color: rgba(224, 139, 255, 0.39); } #notification_area div.notification.awmessage div.icon, #notification_area div.notification.newmessage div.icon { background-color: rgba(57, 106, 252, 0.5); } .content.js-dropdown-item-list { background-color: #fffedb; } .item.trade.option.even { background-color: #fffedb; } .grepolis_score .summary .card_background { filter: grayscale(50%) hue-rotate(10deg); } .grepolis_score .score_content li.award_group:nth-child(2n+1) { background-color: #fffedb; } .grepolis_score .score_content li.award_group:nth-child(2n) { background-color: #faffc2; } .shadow_box .content_background { background-color: #143a50; opacity: .7; } .classic_window.heroes_train .heroes_train .middle_border { background: #fffedb; } .classic_window.heroes_train .heroes_train .inner_border { background: url() ;  background: #faffc2; } .dropdown-list.default { background-color: #fffedb; } #message_report_affront_dialog { background: transparent url() ; background: #fffedb; } #affront_input, #affront_player { background: transparent url() ; background-color: #faffc2; } .advisor_hint { background: url() ; background-color: #fffedb; } div.island_info_towns ul { background: url() ; background-color: #fffedb; } .captain_commercial .message { background-color: #fffedb; } .gp_window.classic_sub_window > .background { background: url() ;  background-color: #faffc2; } .gp_window.classic_sub_window > .border_b, .gp_window.classic_sub_window > .border_t { filter: grayscale(50%) hue-rotate(10deg); } .gp_window.classic_sub_window > .border_l, .gp_window.classic_sub_window > .border_r { filter: grayscale(50%) hue-rotate(10deg); } .content.js-dropdown-item-list.instant_buy { background-color: #fffedb; } .tooltip_with_arrow .twa_border_top { filter: grayscale(50%) hue-rotate(10deg); } .tooltip_with_arrow .twa_background_fake { filter: grayscale(50%) hue-rotate(10deg); } .tooltip_with_arrow .twa_border_left { filter: grayscale(50%) hue-rotate(10deg); } .tooltip_with_arrow .twa_border_right { filter: grayscale(50%) hue-rotate(10deg); } .tooltip_with_arrow .twa_border_bottom { filter: grayscale(50%) hue-rotate(10deg); } .tooltip_with_arrow.arrow-right-bottom .twa_arrow, .tooltip_with_arrow.arrow-right-middle .twa_arrow, .tooltip_with_arrow.arrow-right-top .twa_arrow { filter: grayscale(50%) hue-rotate(10deg); } .tooltip_with_arrow .twa_corner_tl { filter: grayscale(50%) hue-rotate(10deg); } .tooltip_with_arrow .twa_corner_tr { filter: grayscale(50%) hue-rotate(10deg); } .tooltip_with_arrow .twa_corner_br { filter: grayscale(50%) hue-rotate(10deg); } .tooltip_with_arrow .twa_corner_bl { filter: grayscale(50%) hue-rotate(10deg); } .sandy-box .middle { filter: grayscale(50%) hue-rotate(10deg);} .sandy-box .border_l, .sandy-box .border_r { filter: grayscale(50%) hue-rotate(10deg);} .sandy-box .border_b, .sandy-box .border_t { filter: grayscale(50%) hue-rotate(10deg);} .sandy-box .corner_bl, .sandy-box .corner_br, .sandy-box .corner_tl, .sandy-box .corner_tr { filter: grayscale(50%) hue-rotate(10deg);} .box.middle.center div.box_content { background: #fffedb; } div.quote div.quote_message { background-color: #effcec; } .daily_login_wrapper { filter: grayscale(50%); } #ph_trader_image { filter: grayscale(50%); } .game_inner_box .game_body2 { background: url() ; background-color: #faffc2; } .ph_order_info { filter: grayscale(50%); } .background_default { background: url() ; background-color: #fffedb; } .attack_planner.attacks .attacks_list { background: url() ; background-color: #fffedb; } .textarea .middle { filter: grayscale(50%); } .attack_planner .details_container { background: url() ; background-color: #fffedb; } .attack_planner .bar_top { background: url() ; background-color: #fffedb; } .attack_planner .town_box .town_name_box { background-color: #eef3fe; } .attack_planner .units_box td { background-color: #eef3fe; } .attack_planner.show_plan .attacks_list li.selected { background-color: #faffc2; } .attack_planner li.selected { background: #faffc2 url(https://gppt.innogamescdn.com/images/game/unit_overview/arrow_right.png) no-repeat left; } .popup_middle_middle { background: url(); background-color: #faffc2; } .town_infos { background-color: #fffedb; } .popup_table_inside { background-color: #fffedb; } .popup_top_middle { filter: grayscale(50%) hue-rotate(10deg); } .popup_middle_left { filter: grayscale(50%) hue-rotate(10deg); } .popup_middle_right { filter: grayscale(50%) hue-rotate(10deg); } .popup_bottom_middle { filter: grayscale(50%) hue-rotate(10deg); } .classic_window .filler { background: url() ; background-color: #fff896e8; } div.gpwindow_content { background: url() ; background-color: #fff896e8; } #buildings .building { filter:  grayscale(50%); } .color_highlight, .item_selected { background: #f7e18cf0; } .game_table_odd { background: url(); background: #fffedb; } .game_table { background: url(); } .game_list .odd { background-image: url(); background-color: #fffedb; } .odd { background: url() ; background-color: #faffc2; } .game_list .even { background-image: url(); background-color: #faffc2; } .even { background: url() ; background-image: url(); } .game_list_footer { background: url(); background-color: #faffc2; } .game_inner_box .game_footer { background-color: #faffc2; } .game_body { background: url() ;  background-color: #fffedb; } #folder_toggle_menu { background: transparent url() ; background-color: #fffedb; } #message_message, #message_new_message { background-color: #effcec; } .notes .window_content .notes_container textarea { background-color: #effcec; } .notes .window_content .notes_container .preview_box { background: url() ; background-color: #faffc2; } .forum_toggle { background: transparent url() ; position: relative; background-color: #faffc2; } #thread_functions { background: transparent url() ; background-color: #fffedb; } .forum_toggle #toggle { background: url() ; background-color: #fff896e8; } textarea { background-color: #effcec; } #newthread { background: transparent url() ; } #newthread #bbcodes { background: transparent url() ; } #post_save_wrapper { background: transparent url() ; background-color: #fffedb; } #poll_wrapper { background: transparent url() ; background-color: #fffedb; } #forum_admin .forum.odd .name .text_box { background: transparent url() ; background-color: #fffedb; } #forum_admin .forum.even .name .text_box { background: transparent url() ; background-color: #faffc2; } .classic_window .wnd_border_l, .classic_window .wnd_border_r { filter: grayscale(50%) hue-rotate(10deg); } .classic_window .corner_bl, .classic_window .corner_br, .classic_window .corner_tl, .classic_window .corner_tr { filter: grayscale(50%) hue-rotate(10deg); } .classic_window .wnd_border_b, .classic_window .wnd_border_t { filter: grayscale(50%) hue-rotate(10deg); } .box.middle.center { background: url(); background-color: #faffc2; } .box.bottom.left { filter: grayscale(50%) hue-rotate(10deg); } .special_buildings_image { filter: grayscale(50%) hue-rotate(10deg); } .colA0A0FF { background: #c4f4f4; } .box.bottom.right { filter: grayscale(50%) hue-rotate(10deg); } .box.top.left { filter: grayscale(50%) hue-rotate(10deg); } .box.top.right { filter: grayscale(50%) hue-rotate(10deg); } #town_group_active_towns, #town_group_all_towns { background: url() ;  background-color: #faffc2; } .trade_town_wrapper { filter: grayscale(50%) hue-rotate(10deg); } div.overview_search_bar { background: url() ; background: #faffc2; } #trade_selected { background: url() ; background: #faffc2; } .textbox .middle { filter: grayscale(50%); } span.grepo_input select { filter: grayscale(50%); } .town_info_input { filter: grayscale(50%); } #recruit_overview .cell_casted_powers { background-color: #faffc2; } .box.middle.center div.box_content { background: #faffc2; } #outer_troops_box .outer_troops_sort_box {  background: url() ; background-color: #faffc2; } #building_overview tr td.locked {  background-color: #fff33b; } .building_overview #building_overview td.building.hover, .building_overview #building_overview tr:hover { background: #feec88; } #building_overview td.locked.hover, #building_overview td.locked:hover { background-color: #ffc4c4; } .celebration_name.bold { filter: grayscale(50%); } #culture_overview_towns div.celebration_button, #culture_overview_towns div.celebration_icon, #culture_overview_towns div.celebration_icon_bg, #culture_overview_towns div.celebration_name, #culture_overview_towns div.celebration_progressbar, #culture_overview_towns div.celebration_progressbar div, #hides_overview_towns div.help_button, #hides_overview_towns div.hide_icon, #hides_overview_towns div.hide_icon_bg, #hides_overview_towns div.hide_progressbar, #hides_overview_towns div.hide_progressbar div, #hides_overview_towns div.iron_name { filter: grayscale(30%); } #town_group_active_towns, #town_group_all_towns { filter: grayscale(50%); } #active_town_list_head, #all_town_list_head { filter: grayscale(50%); } #townsoverview .game_list li:hover { background-image: url(); background-color: #faffc2; } .farm_town .action_wrapper .trading_wrapper { filter: grayscale(50%); } .farm_towns .actions .action_wrapper .action_card { filter: grayscale(50%); } .farm_towns .actions .action_wrapper .action_card { filter: grayscale(50%); } .farm_towns .actions .resources::after { filter: grayscale(50%); } .farm_towns .actions .units::after { filter: grayscale(50%); } .farm_towns .actions .trade::after { filter: grayscale(50%); } .message_post_content { background: url(); background-color: #faffc2; } #message_partner { background: url(); background-color: #fffedb; } .message_post { background: url(); background-color: #fffedb; } #ally_announce_bbcodes { background: url() ; background-color: #fffedb; } .gp_tab .gp_pc_left, .gp_tab .gp_pc_middle, .gp_tab .gp_pc_right { filter: grayscale(50%); } .published_report .espionage_report, .published_report .power_report { background: #effcec; } .published_report .report_units_overview { background: #effcec; } .published_report_header { background-color: #cad0ff; } #island_towns_controls { background: url(h) ; background-color: #fffedb; } #fto_town_list { background: url() ; background-color: #fffedb; } #fto_town_list li.fto_town.active, div.fto_time_checkbox.active { background: #faffc2; } #fto_town_list li.fto_island { background: url() ; background-color: #fffedb; } .table_box .table_box_content .body { background: url() ;  background-color: #fffedb; } .questlog_index .quest.selected { background: url() ; background-color: #fffedb; } .brown { background: url() ; background: #faffc2; } #ally_finder_text tr:first-child { background-color: #b2dcfa; } .ui_construction_queue .construction_queue_frame .queue_BG_slice-middle { filter: grayscale(50%); } #ally_announce_textarea { background-color: #effcec; } #ally_profile_textarea { background-color: #effcec; } #ally_flags .game_body { background-image: url(); } .reservation_tool .gp_tab_page { background: url() ;  background-color: #fffedb; } table.present_data tr.even { background: url() ; background-color: #fffedb; } table.present_data tr.odd { background: url() ; background-color: #faffc2; } #ally_pact_list { background-color: #faffc2; } #premium_overview_inner { background: url() ; background-color: #fffedb; } .advisors_container .advisors_box .advisor_box .extension_box { filter: grayscale(50%); } #mines_values tr.even { background: url(); background-color: #fffedb; } #mines_values tr.odd { background: url(); background-color: #faffc2; } .background_light { background: url() ; background-color: #fffedb; } #mines_text { background-image: url(); background-color: #fffedb; } #ally_profile_info #ally_pacts, #ally_profile_info #ally_profile { background: url() ; background-color: #fffedb; } #ally_towns .members_list li.header { background: url() ; background-color: #fffedb; } #ally_towns .members_list { background: url() ; background-color: #faffc2; } #premium_exchange .premium_exchange_rules .expand_text { background: url() ;  background-color: #fffedb; } #premium_exchange .premium_exchange_rules .rules { background: url() ; background-color: #fffedb; } .marketplace.all_offers tr:nth-child(2n):not(.premium_exchange), .marketplace.own_offers tr:nth-child(2n):not(.premium_exchange) { background: url() repeat 0 0; background-color: #faffc2; } .marketplace.all_offers table, .marketplace.own_offers table { background: url() ; background-color: #fffedb; } .marketplace.create_offer .section.market_offer { filter: grayscale(50%); } #premium_exchange { filter: grayscale(50%); } .spinner .body, .spinner .border_l, .spinner .border_r, .spinner .button_down, .spinner .button_up { filter: grayscale(50%); } .marketplace.own_offers #town_filter {filter: grayscale(50%); } #unit_order div.unit_order_tab { filter: grayscale(50%); } .unit.unit_order_unit_image.unit_icon50x50:hover { -webkit-border-radius: 20px; transform: scaleX(1.1); padding: 2px; filter: hue-rotate(-50deg); box-shadow: 3px 8px 30px #00dbff; } .curtain_box .cb_bg { background-color: #fffedb; } .attack_spots .attacking_units .cb_bg, .attack_spots .defending_units .cb_bg { background: url() ; } .attack_spots .attacking_units .curtain_box .cb_bg { background: url() ; } .hide_window_wrapper .hide_window_background { filter: blur(90px) grayscale(100%); } #place_culture_bg { filter: grayscale(50%); } .place_simulator_odd, .place_simulator_odd2 { filter: grayscale(50%); } .place_simulator_even, .place_simulator_even2 { filter: grayscale(50%); } span.grepo_input input { filter: grayscale(50%); } .god_selection .background { filter: blur(90px) grayscale(100%); } .report_units_overview { background: url(); background-color: #fffedb; } .report_booty_bonus_fight { background: url(); background-color: #faffc2; } #folder_menu_reports { background: transparent url() background-color: #e5f7b5; } .dropdown.blue_arrow .border-left, .dropdown.blue_arrow .border-right, .dropdown.blue_arrow .caption, .dropdown.default .border-left, .dropdown.default .border-right, .dropdown.default .caption { filter: grayscale(50%); } .academy .academy_image { filter: blur(90px) grayscale(100%); } .construction_queue_sprite { filter: grayscale(50%); } .various_orders_queue .various_orders_middle { filter: grayscale(50%); } .main_window_background { filter: blur(90px) grayscale(100%); } .docks.window_background { filter: blur(90px) grayscale(100%); } #unit_order_values td { background: #f2e8d2; } #unit_order_unit_info td { background: #f2e8d2; } #unit_order_ph_background { filter: grayscale(50%); } #towninfo_description { background: #faffc2;}.town_cast_spell_oldcontent { background: #faffc2 !important; }.ironer_window_background { filter: blur(90px) grayscale(100%); } .window_storage_wrapper .storage_window_background { filter: blur(90px) grayscale(100%); } .storage_resbar { filter: grayscale(50%); } .stoner_window_background { filter: blur(90px) grayscale(100%); } .lumber_window_background { filter: blur(90px) grayscale(100%); } .wall_window_background { filter: blur(90px) grayscale(100%); } .place_window_background { filter: blur(90px) grayscale(100%); } .marketplace .marketplace_window_background { filter: blur(90px) grayscale(100%); } .farm_window_background { filter: blur(90px) grayscale(100%); } .game_inner_box .game_footer { background-image: url(); background-color: #faffc2; } .barracks.window_background { filter: blur(90px) grayscale(100%); } .academy .tech_tree_box .column { border-left: 2px groove #d6b468; background: url() ; } .academy .tech_tree_box .column.inactive { background-image: url(); background-color: #c3d1cd;} a.submenu_link .left, a.submenu_link .middle, a.submenu_link .right { filter: grayscale(20%) hue-rotate(5deg);} div.gpwindow_left, div.gpwindow_right { #fffedb;} div.gpwindow_bottom { filter: grayscale(50%) hue-rotate(10deg);} div.gpwindow_top {  filter: grayscale(50%) hue-rotate(10deg);} div.gpwindow_left, div.gpwindow_right { filter: grayscale(50%) hue-rotate(10deg);} .academy .research_points_box { filter:  grayscale(50%); } </style>').appendTo("head");
                }
                //Pink
                if (DATA.options.joe_te) {
                    $('<style id="joe_Scrollbar"> .cmd_span_custom,.troops_arrive_at{outline-style:none;font-weight:700;text-decoration:none;cursor:pointer}.bbcode_box.bottom_center,.bbcode_box.bottom_left,.bbcode_box.bottom_right,.bbcode_box.middle_left,.bbcode_box.middle_right,.bbcode_box.top_center,.bbcode_box.top_left,.bbcode_box.top_right,.gp_window.classic_sub_window>.border_b,.gp_window.classic_sub_window>.border_l,.gp_window.classic_sub_window>.border_r,.gp_window.classic_sub_window>.border_t,.grepolis_score .summary .card_background,.sandy-box .border_b,.sandy-box .border_l,.sandy-box .border_r,.sandy-box .border_t,.sandy-box .corner_bl,.sandy-box .corner_br,.sandy-box .corner_tl,.sandy-box .corner_tr,.sandy-box .middle,.tooltip_with_arrow .twa_background_fake,.tooltip_with_arrow .twa_border_bottom,.tooltip_with_arrow .twa_border_left,.tooltip_with_arrow .twa_border_right,.tooltip_with_arrow .twa_border_top,.tooltip_with_arrow .twa_corner_bl,.tooltip_with_arrow .twa_corner_br,.tooltip_with_arrow .twa_corner_tl,.tooltip_with_arrow .twa_corner_tr,.tooltip_with_arrow.arrow-right-bottom .twa_arrow,.tooltip_with_arrow.arrow-right-middle .twa_arrow,.tooltip_with_arrow.arrow-right-top .twa_arrow{filter:grayscale(20%) hue-rotate(10deg)} .cmd_span_custom{color:#ff006c}.troops_arrive_at{color:#0058ff}div.game_border{background-color:#ffdbf4}#unit_order_confirm:hover,a#unit_order_max:hover,a#unit_order_min:hover,a.left:hover,a.right:hover,a.unit_order_show:hover{box-shadow:-1px -1px 10px #00ff34}[ng-app=bot][new][ng-controller=commander]{background:repeating-linear-gradient(45deg,#dc8df9 0,#e88afb 10%,#e198fc 0,#ecadf9 50%) 0/15px 15px;text-shadow:0 0 10px #fff,0 0 20px #fff,0 0 30px #fff,0 0 40px #BA22FF,0 0 70px #E322FF,0 0 80px #D922FF,0 0 100px #F822FF,0 0 150px #F822FF;outline:hsla(292.4,100%,81.4%,.93) solid 5px}[ng-app=bot][new][ng-controller=heraldController] .attacks .attack,button{background-color:#fedbff}[ng-app=bot][new] button:nth-child(n+2){margin-left:0}.botSettings{background-color:#ffb4e7e0}.botSettings .control{border-bottom:solid 2px #ffc2f5}.botSettings .control:hover{background-color:#fedbff}.queue2{background-color:#ffb4e7e0}[ng-app=bot][new][ng-controller=commanderOrdersController] .orders .order{background-color:#fedbff}[ng-app=bot][new].window{background:0 0}#trade_tab .content { background: #ffdbf4 url(https://i.imgur.com/BCUgYDS.gif);}.bbcode_box.middle_center,.tooltip_reward_day .reward_wrapper{background:url() #ffdbf4}.bb_ally_chooser_ally_input.ac_input,.bb_player_chooser_player_input.ac_input,.bb_town_chooser_town_input.ac_input{background-color:#effcec}#notification_area div.description{background-color:rgba(249,112,195,.68)}.farm_towns.lvl_0 .actions .action_wrapper{background:url() #ffdbf4}#ranking_search_info,.ac_odd,.farm_towns.lvl_0 .actions .action_wrapper .bpv_trade_illustration{background:url() #ffc2ea}.ac_even{background:url() #ffdbf4}.ac_over{background-color:#ffdbf4}#notification_area div.notification{background-color:rgba(0,0,0,0)}#notification_area div.notification.incoming_attack div.icon{background-color:rgba(255,130,130,.5)}#notification_area div.notification.incoming_support div.icon{background-color:rgba(134,255,130,.5)}#notification_area div.notification.resourcetransport div.icon{background-color:rgba(250,233,212,.5)}#notification_area div.notification.newreport div.icon{background-color:rgba(255,255,130,.5)}#notification_area div.notification.newaward div.icon{background-color:rgba(224,139,255,.39)}#notification_area div.notification.awmessage div.icon,#notification_area div.notification.newmessage div.icon{background-color:rgba(57,106,252,.5)}.content.js-dropdown-item-list,.grepolis_score .score_content li.award_group:nth-child(2n+1),.item.trade.option.even{background-color:#ffdbf4}.grepolis_score .score_content li.award_group:nth-child(2n){background-color:#ffc2ea}.shadow_box .content_background{background-color:#143a50;opacity:.7}.classic_window.heroes_train .heroes_train .middle_border{background:#ffdbf4}.classic_window.heroes_train .heroes_train .inner_border{background:#ffc2ea}.dropdown-list.default{background-color:#ffdbf4}#message_report_affront_dialog{background:#ffdbf4}#affront_input,#affront_player{background:url() #ffc2ea}.advisor_hint,div.island_info_towns ul{background:url() #ffdbf4}.captain_commercial .message{background-color:#ffdbf4}.gp_window.classic_sub_window>.background{background:url() #ffc2ea}.temple_gods_large{background-image:url(https://i.imgur.com/xUroKua.png)}.god_selection #temple_gods{background:url(https://i.imgur.com/xUroKua.png) -995px 0 no-repeat}.content.js-dropdown-item-list.instant_buy{background-color:#ffdbf4}#ph_trader_image,.daily_login_wrapper,.ph_order_info,.textarea .middle{filter:grayscale(20%)}div.quote div.quote_message{background-color:#effcec}.game_inner_box .game_body2{background:url() #ffc2ea}.attack_planner .bar_top,.attack_planner .details_container,.attack_planner.attacks .attacks_list,.background_default{background:url() #ffdbf4}.attack_planner .town_box .town_name_box,.attack_planner .units_box td{background-color:#eef3fe}.attack_planner.show_plan .attacks_list li.selected{background-color:#ffc2ea}.attack_planner li.selected{background:url(https://gppt.innogamescdn.com/images/game/unit_overview/arrow_right.png) left no-repeat #ffc2ea}#joe_town_popup .god_content,#joe_town_popup .hero_content,#joe_town_popup .resources_content,#joe_town_popup .spy_content,#joe_town_popup .unit_content{background:#ffc2ea}.popup_middle_middle{background:url() #ffc2ea}.popup_table_inside,.town_infos{background-color:#ffdbf4}.popup_bottom_middle,.popup_middle_left,.popup_middle_right,.popup_top_middle{filter:grayscale(20%) hue-rotate(10deg)}.classic_window .filler,div.gpwindow_content{background:url();background-color:#ffb1e1f0}#buildings .building{filter:grayscale(20%)}.box.bottom.left,.box.bottom.right,.box.top.left,.box.top.right,.classic_window .corner_bl,.classic_window .corner_br,.classic_window .corner_tl,.classic_window .corner_tr,.classic_window .wnd_border_b,.classic_window .wnd_border_l,.classic_window .wnd_border_r,.classic_window .wnd_border_t,.special_buildings_image{filter:grayscale(20%) hue-rotate(10deg)}.color_highlight,.item_selected{background:0 0}.game_table_odd{background:#ffdbf4}.game_table{background:url()}.game_list .odd{background-image:url();background-color:#ffc2ea}.odd{background:url() #ffc2ea}.game_list .even{background-image:url();background-color:#ffdbf4}.even,.forum_toggle #toggle{background:url()}.game_list_footer{background:url() #ffc2ea}#folder_toggle_menu,.game_body{background:url() #ffdbf4}#message_message,#message_new_message,.notes .window_content .notes_container textarea{background-color:#effcec}.forum_toggle,.notes .window_content .notes_container .preview_box{background:url() #ffc2ea}.forum_toggle{position:relative}#thread_functions{background:url() #ffdbf4}.forum_toggle #toggle{background-color:#ffb1e1f0}textarea{background-color:#effcec}#newthread,#newthread #bbcodes{background:url()}#forum_admin .forum.odd .name .text_box,#poll_wrapper,#post_save_wrapper{background:url() #ffdbf4}#forum_admin .forum.even .name .text_box,.box.middle.center{background:url() #ffc2ea}.colA0A0FF{background:#c4f4f4}#trade_selected,.box.middle.center div.box_content,div.overview_search_bar{background:#ffc2ea}.trade_town_wrapper{filter:grayscale(20%) hue-rotate(950deg)}.celebration_name.bold,.textbox .middle,.town_info_input,span.grepo_input select{filter:grayscale(20%)}#recruit_overview .cell_casted_powers{background-color:#ffc2ea}#outer_troops_box .outer_troops_sort_box{background:url() #ffc2ea}#building_overview tr td.locked{background-color:#fe88d0}.building_overview #building_overview td.building.hover,.building_overview #building_overview tr:hover{background:#fbfcd2}#building_overview td.locked.hover,#building_overview td.locked:hover{background-color:#ffc4c4}#culture_overview_towns div.celebration_button,#culture_overview_towns div.celebration_icon,#culture_overview_towns div.celebration_icon_bg,#culture_overview_towns div.celebration_name,#culture_overview_towns div.celebration_progressbar,#culture_overview_towns div.celebration_progressbar div,#hides_overview_towns div.help_button,#hides_overview_towns div.hide_icon,#hides_overview_towns div.hide_icon_bg,#hides_overview_towns div.hide_progressbar,#hides_overview_towns div.hide_progressbar div,#hides_overview_towns div.iron_name{filter:grayscale(30%)}#active_town_list_head,#all_town_list_head,#premium_exchange,#town_group_active_towns,#town_group_all_towns,#unit_order div.unit_order_tab,.advisors_container .advisors_box .advisor_box .extension_box,.farm_town .action_wrapper .trading_wrapper,.farm_towns .actions .action_wrapper .action_card,.farm_towns .actions .resources::after,.farm_towns .actions .trade::after,.farm_towns .actions .units::after,.gp_tab .gp_pc_left,.gp_tab .gp_pc_middle,.gp_tab .gp_pc_right,.marketplace.create_offer .section.market_offer,.marketplace.own_offers #town_filter,.spinner .body,.spinner .border_l,.spinner .border_r,.spinner .button_down,.spinner .button_up,.ui_construction_queue .construction_queue_frame .queue_BG_slice-middle{filter:grayscale(20%)}#townsoverview .game_list li:hover{background-image:url();background-color:#ffc2ea}.message_post_content{background:url() #ffc2ea}#ally_announce_bbcodes,#message_partner,.message_post{background:url() #ffdbf4}.published_report .espionage_report,.published_report .power_report,.published_report .report_units_overview{background:#effcec}.published_report_header{background-color:#cad0ff}#island_towns_controls{background:url(h) #ffdbf4}#fto_town_list{background:url() #ffdbf4}#fto_town_list li.fto_town.active,div.fto_time_checkbox.active{background:#ffc2ea}#fto_town_list li.fto_island,.questlog_index .quest.selected,.table_box .table_box_content .body{background:url() #ffdbf4}.brown{background:#ffc2ea}#ally_finder_text tr:first-child{background-color:#b2dcfa}#ally_announce_textarea,#ally_profile_textarea{background-color:#effcec}#ally_flags .game_body{background-image:url()}.reservation_tool .gp_tab_page,table.present_data tr.even{background:url() #ffdbf4}table.present_data tr.odd{background:url() #ffc2ea}#ally_pact_list{background-color:#ffc2ea}#mines_values tr.even,#premium_overview_inner{background:url() #ffdbf4}#mines_values tr.odd{background:url() #ffc2ea}.background_light{background:url() #ffdbf4}#mines_text{background-image:url();background-color:#ffdbf4}#ally_profile_info #ally_pacts,#ally_profile_info #ally_profile,#ally_towns .members_list li.header{background:url() #ffdbf4}#ally_towns .members_list{background:url() #ffc2ea}#premium_exchange .premium_exchange_rules .expand_text,#premium_exchange .premium_exchange_rules .rules{background:url() #ffdbf4}.marketplace.all_offers tr:nth-child(2n):not(.premium_exchange),.marketplace.own_offers tr:nth-child(2n):not(.premium_exchange){background:url() #ffc2ea}.marketplace.all_offers table,.marketplace.own_offers table{background:url() #ffdbf4}.unit.unit_order_unit_image.unit_icon50x50:hover{-webkit-border-radius:20px;transform:scaleX(1.1);padding:2px;filter:hue-rotate(-50deg);box-shadow:3px 8px 30px #00dbff}.curtain_box .cb_bg{background-color:#ffdbf4}.attack_spots .attacking_units .cb_bg,.attack_spots .attacking_units .curtain_box .cb_bg,.attack_spots .defending_units .cb_bg{background:url()}.hide_window_wrapper .hide_window_background{filter:blur(90px) grayscale(100%)}#place_culture_bg,.place_simulator_even,.place_simulator_even2,.place_simulator_odd,.place_simulator_odd2,span.grepo_input input{filter:grayscale(20%)}.god_selection .background{filter:blur(90px) grayscale(100%)}.report_units_overview{background:url() #ffdbf4}.report_booty_bonus_fight{background:url() #ffc2ea}#folder_menu_reports{background:url() #e5f7b5}.dropdown.blue_arrow .border-left,.dropdown.blue_arrow .border-right,.dropdown.blue_arrow .caption,.dropdown.default .border-left,.dropdown.default .border-right,.dropdown.default .caption{filter:grayscale(20%)}.academy .academy_image{filter:blur(90px) grayscale(100%)}.construction_queue_sprite,.various_orders_queue .various_orders_middle{filter:grayscale(20%)}.docks.window_background,.main_window_background{filter:blur(90px) grayscale(100%)}#unit_order_unit_info td,#unit_order_values td{background:#f2e8d2}#unit_order_ph_background{filter:grayscale(20%)}#towninfo_description{background:#ffc2ea}.town_cast_spell_oldcontent { background: #ffc2ea !important; }.ironer_window_background,.window_storage_wrapper .storage_window_background{filter:blur(90px) grayscale(100%)}.storage_resbar{filter:grayscale(20%)}.barracks.window_background,.farm_window_background,.lumber_window_background,.marketplace .marketplace_window_background,.place_window_background,.stoner_window_background,.wall_window_background{filter:blur(90px) grayscale(100%)}.game_inner_box .game_footer{background-image:url();background-color:#ffc2ea}.academy .tech_tree_box .column{border-left:2px groove #d6b468;background:url()}.academy .tech_tree_box .column.inactive{background-image:url();background-color:#c3c4d1}a.submenu_link .left,a.submenu_link .middle,a.submenu_link .right{filter:grayscale(20%) hue-rotate(5deg)}div.gpwindow_bottom,div.gpwindow_left,div.gpwindow_right,div.gpwindow_top{filter:grayscale(20%) hue-rotate(10deg)}.academy .research_points_box{filter:grayscale(20%)} </style>').appendTo("head");
                }
                //halloween
                if (DATA.options.joe_tf) {
                    $('<style id="joe_Scrollbar">#trade_tab .content { background: #f9f9f999 url(https://i.imgur.com/BCUgYDS.gif);}.gods_area .gods_container.god.zeus { background: url(https://i.ibb.co/NFgxStr/gods-layout-grande-halloween.png) no-repeat -76px -154px; } .gods_area .gods_container.god.artemis { background: url(https://i.ibb.co/NFgxStr/gods-layout-grande-halloween.png) no-repeat 0 -78px; } .gods_area .gods_container.god.hera { background: url(https://i.ibb.co/NFgxStr/gods-layout-grande-halloween.png) no-repeat -156px -76px; } .gods_area .gods_container.god.poseidon { background: url(https://i.ibb.co/NFgxStr/gods-layout-grande-halloween.png) no-repeat 0 -154px;; } .gods_area .gods_container.god.hades { background: url(https://i.ibb.co/NFgxStr/gods-layout-grande-halloween.png) no-repeat -156px 0; } .gods_area .gods_container.god.athena { background: url(https://i.ibb.co/NFgxStr/gods-layout-grande-halloween.png) no-repeat -76px -78px; } .god_selection .js-list .zeus_small { background: url(https://i.ibb.co/sJYsv2w/gods-temple-halloween.png) no-repeat -870px -787px; } .god_selection .js-list .poseidon_small { background: url(https://i.ibb.co/sJYsv2w/gods-temple-halloween.png) no-repeat -870px -737px; } .god_selection .js-list .hera_small { background: url(https://i.ibb.co/sJYsv2w/gods-temple-halloween.png) no-repeat -870px -687px; } .god_selection .js-list .athena_small { background: url(https://i.ibb.co/sJYsv2w/gods-temple-halloween.png) no-repeat -870px -587px; } .god_selection .js-list .hades_small { background: url(https://i.ibb.co/sJYsv2w/gods-temple-halloween.png) no-repeat -870px -637px; } .god_selection .js-list .artemis_small { background: url(https://i.ibb.co/sJYsv2w/gods-temple-halloween.png) no-repeat -870px -537px; } .god_selection #temple_gods { background: url(https://i.imgur.com/xUroKua.png) no-repeat -995px 0; } .temple_gods_large { background-image: url(https://i.imgur.com/AQAHoVM.png); } .alliance_temple_overview .content tbody tr:nth-child(2n+1) { background: url() ; } .popup_middle_middle { background: linear-gradient(0deg,rgba(255, 255, 255, 0.62),rgba(255, 255, 255, 0.64)),url(https://gppt.innogamescdn.com/images/game/overviews/group_list_bg.jpg) repeat-y; } .alliance_temple_overview .content tbody tr:nth-child(2n) { background: url() ; background-color: #ffffff69 ; } .alliance_temple_overview .expandable_list .content, .alliance_temple_overview .expandable_list .expand_text { background: url(); } .even { background: url() ; background-color: #f9f9f969; } #townsoverview .game_list li:hover { background-image: url(); }#town_group_active_towns { background: linear-gradient(0deg,rgba(255, 255, 255, 0.62),rgba(255, 255, 255, 0.64)),url(https://gppt.innogamescdn.com/images/game/overviews/group_list_bg.jpg) repeat-y; } .building_overview #building_overview td.building.hover, .building_overview #building_overview tr:hover { background: #a3fd7142; } #joe_town_popup .god_content { background-color: #f9f9f999; } #joe_town_popup .spy_content { background-color: #f9f9f999; } #joe_town_popup .resources_content { background-color: #f9f9f999; } #joe_town_popup .unit_content { background-color: #f9f9f999; } .farmtown_tooltip { background-color: #f9f9f999; } .game_list li { background-color: #f9f9f999; }  .temple_power_popup { background-color: #f9f9f999; } .popup_middle_middle { background: linear-gradient(0deg,rgba(255, 255, 255, 0.62),rgba(255, 255, 255, 0.64)),url(https://i.imgur.com/2STCQgX.png); } .god_selection .background  { background: url(https://i.imgur.com/lij0NI5.png)no-repeat 0 0; } .ng-scope { background-color: #f9f9f999; } .subsection.captain.enabled { background-color: #f9f9f999; }.subsection.curator.enabled { background-color: #f9f9f999; }.game_body { background: url(); } .table_box .table_box_content .body { background: rgba(255, 255, 255, 0.58) url("") ; } .classic_window .filler  { background: url(); } .classic_window .filler  { background: url(https://i.imgur.com/2STCQgX.png); } .ironer_window_background  { background: url(https://i.imgur.com/7MpKgbt.png); } .academy .academy_image  { background: url(https://i.imgur.com/8SwufpV.jpg); } .place_window_background  { background: url(https://i.imgur.com/3PVFZb6.png); } .window_storage_wrapper .storage_window_background  { background: url(https://i.imgur.com/g4DLjxQ.png); } .popup_table_inside { background-color: #f9f9f999; } .town_infos { background-color: #f9f9f999; } .window_storage_wrapper div.storage_resbars span  { background-color: #f9f9f999; } .hide_window_wrapper .hide_window_background  { background: url(https://i.imgur.com/HgBSwLh.png); } .marketplace .marketplace_window_background  { background: url(https://i.imgur.com/jx0HCDd.png); } .wall_window_background  { background: url(https://i.imgur.com/qpts9L6.png); } .docks.window_background  { background: url(https://i.imgur.com/ARCcaoQ.png); } .barracks.window_background  { background: url(https://i.imgur.com/OYSJWX4.png) no-repeat 0 0; } .farm_window_background  { background: url(https://i.imgur.com/2zgnPpe.png); } .game_body  { background-color: #f9f9f999; } .fight_report_classic { opacity: 0.8; } div.gpwindow_content  { background: linear-gradient(0deg,rgba(255, 255, 255, 0.62),rgba(255, 255, 255, 0.64)),url(https://i.imgur.com/2STCQgX.png); } div.gpwindow_content  { background-color: #ffe2a1b3; } .main_window_background  { background: url(https://i.imgur.com/PX3tt4a.png); } #main_tasks { background-color: #aead9099; } .lumber_window_background  { background: url(https://i.imgur.com/Q0oNcbc.png); } .brown  { background: url(); } .brown  { background-color: #f9f9f999; } .questlog_index .quest.selected  { background: url(); } .questlog_index .quest.selected  { background-color: #8aa1e880; } .island_quest_details .description  { background-color: #f9f9f999; } .questlog_detail .quest_description  { background-color: #f9f9f999; } .island_quest_details .tasks .task_description  { background-color: #f9f9f999; } #joe_settings .content .content_category  { background-color: #f9f9f999; } .settings-menu  { background-color: #f9f9f999; } .settings-container  { background-color: #f9f9f999; } #temple_god_description h4, #temple_god_description p  { background-color: #f9f9f999; } #town_group_overview  { background-color: #f9f9f999; } .info_dialog.info_create_first_town_group { background-color: #f9f9f999; } legend { background-color: #f9f9f999; } #message_reply_preview { background: url(); } .game_body{ font-size: 13px; font-family: Comic Sans MS, sans-serif; font-stretch: semi-condensed; } #message_message, #message_new_message  { background-color: #b2b8cacc }; .even  { background: url(); } .game_list .even  { background: url(); } #message_reply_message { height: 107px; width: 772px; margin: 10px 0; background-color: #4f4f5480; } #pact_info_box { background-color: #f9f9f999; } .attack_support_window .troops_from_this_town { background-color: #f9f9f999; } .town_cast_spell_content .header { background-color: #f9f9f999; } .marketplace.own_offers .header { background-color: #f9f9f999; } .game_list .odd  { background: url(); } .game_list .odd { background-color: #f9f9f999; } .academy .tech_tree_box .column { background: url(); } .academy .tech_tree_box .column { background-color: #f9f9f999; } .academy .tech_tree_box .column.inactive  { background: url(); } .academy .tech_tree_box .column.inactive { background-color: #dcdb3333; } .stoner_window_background { background: url(https://i.imgur.com/xigCw6F.png); } .radiobutton { background-color: #f9f9f999; } .notes .window_content .notes_container textarea { background-color: #b2b8cacc; } .notes .window_content .notes_container .preview_box {  background: url(); } .notes .window_content .notes_container .preview_box { background-color: #959bb8e6; } #edit_profile_form textarea { background-color: #b2b8cacc; } .label_box label { background-color: #f9f9f999; } h4 { background-color: #fefefeb0; } .separate_forum_tab_link { background: #fefefeb0; } #forum_admin div.game_list_footer, #thread_list_form #forum div.game_list_footer { background: #fefefeb0; } #post_save_wrapper  { background: url(); } #post_save_wrapper { background-color: #707789cc; } #post_save_wrapper textarea { background-color: #917d7d4d; } #forum_admin .forum.odd .name .text_box  { background: url(); } #forum_admin .forum.even .name .text_box  { background: url(); } #forum div.game_list_footer  { background: #fefefeb0; } #newthread { background: url(); } #forum_post_textarea.newthread { background-color: #917d7d4d; } #newthread #bbcodes url(); } #newthread #bbcodes { background-color: #917d7d4d; } .report_booty_bonus_fight  { background: url(); } .report_units_overview  { background: url(); } .customization .content { background-color: #f7f57bcc; } .passwordRecovery { background-color: #f7f57bcc; } .passwordRecovery .control { border-bottom: solid 2px #000e80; } .passwordRecovery .control:hover { background-color: #c8cffa; } #towninfo_description { background: #f9f9f999; }.town_cast_spell_oldcontent { background: #f9f9f999 !important; } .message_post { background: url(); } .message_post { background-color: #938e8e66; } .message_post_content { background: url(); } .message_post_content { background-color: #938e8e66; } div.quote div.quote_message { background-color: #607c5966; } .message_item.even.bottom.ui-draggable { background: linear-gradient(to right,rgba(244, 249, 65, 0.67),rgba(62, 187, 17, 0.42)); } .game_table_odd { background: url(); } .color_highlight, .item_selected { background-color: #2a242466; } .game_table { background: url(); } .game_table { background-color: #f9f9f999; } #ally_flags .game_body { background-image: url(); } #ally_pact_list { background-color: #fee2a14d; } .reservation_tool .gp_tab_page { background: url(); } .reservation_tool .gp_tab_page { background-color: #4a4c5266; } .grepo_menu .gm_middle_center { background: url(); } .grepo_menu .gm_middle_center { background-color: #4a4c5266; } .odd { background: url(); } .odd { background-color: #f9f9f999; } div.island_info_towns ul { background: url(); } div.island_info_towns ul { background-color: #e5edad99; } .island_info { background-color: #f9f9f999; } .game_list .even { background-color: #f9f9f999; } #fto_town_list { background: url(); } #fto_town_list { background-color: #f9f9f999; } #fto_town_list li.fto_island { background: url(); } #fto_town_list li.fto_island { background-color: #f0788499; } #fto_town_list li.fto_town.active, div.fto_time_checkbox.active { background-color: #93f28980; } .box.middle.center { background: linear-gradient(0deg,rgba(255, 255, 255, 0.62),rgba(255, 255, 255, 0.64)),url(https://i.imgur.com/2STCQgX.png); } .box.middle.center { background-color: #ffea46; } .city_overview_building.field_3 { background: url(https://i.imgur.com/imn5ey5.png); } #ally_towns .members_list { background: url(); } #ally_towns .members_list { background-color: #f9f9f999; } #ally_profile_info #ally_pacts, #ally_profile_info #ally_profile { background: url(); } #place_container .error_msg { background-color: #eafa061a;  } .place_box {  color: #000; font-size: 12px; font-weight: 700; margin-top: 3px; background-color: #fff6; } fieldset { background-color: #fefefeb0; } #place_battle_points .points_descr, #place_start_all .bold { background-color: #fff9; } div.command_info .attacker .report_town_bg, div.command_info .attacker ul { background-color: #fcfcfcb3; } div.command_info .defender .report_town_bg, div.command_info .defender ul { background-color: #fcfcfcb3; } .arrival_time { background-color: #657af84d; } #way_duration, span.way_duration { background-color: #7af87566; } .way_duration { background-color: #ff7f7f4d; } .countdown { background-color: #1eff2e66; } .box.middle.center div.box_content { background: #f9f9f999; } #last_attacks { background-color: #f9f9f999; } div.espionage_espionage { background-color: #f9f9f999; } #building_overview td.locked.hover, #building_overview td.locked:hover { background-color: #f9515d; } #building_overview tr td.locked { background-color: #9baaff99; } .classic_window.heroes_train .heroes_train .middle_border { opacity: 0.8; } .god_mini { background: url(https://i.imgur.com/7zFoZFX.png); } .grepolis_score .score_content li.award_group:nth-child(2n) { background-color: #fedc92cc; } .grepolis_score .score_content li.award_group:nth-child(2n+1) { background-color: #ffeabbcc; } #farm_town_overview_btn { background-color: #f9f9f999; } #forum_post_textarea.newpoll { background: #4a4c5266; } .troops_arrive_at {  background-color: #435eff80; } #arrival_time { background-color: #657af84d; } .night .city_overview_building.field_3 { background: url(https://i.imgur.com/aZoTpLC.gif) no-repeat; } #townsoverview .game_list li:hover { background-color: #e9ff2d99; } div.group_list_scroll_border { background-color: #f9f9f999; } #town_group_active_towns, #town_group_all_towns  { background: url (); } .advisors_container .top_description { background: #f9f9f999; } .checkbox_description { background-color: #f9f9f999; } #premium_overview_inner { background: url(); } #premium_overview_inner { background: #8aa1e880; } #ally_announce_textarea { background: #4a4c5266; } #ally_profile_textarea { background: #4a4c5266; } .gp_link_fake { background: #f9f9f999; } #folder_menu_reports { background: url(); } #folder_menu_reports { background: #090f3499; } #thread_functions { background: url(); } #thread_functions { background: #f9f9f999; } .marketplace.all_offers tr:nth-child(2n):not(.premium_exchange), .marketplace.own_offers tr:nth-child(2n):not(.premium_exchange) { background: url(); } .marketplace.all_offers table, .marketplace.own_offers table { background: url(); } .marketplace.all_offers table, .marketplace.own_offers table { background: #f9f9f999; } #mines_values tr.even { background: url(); } #mines_values tr.even { background: #f9f9f999; } #mines_values tr.odd { background: url(); } #mines_values tr.odd { background: #f9f9f9e6; } #mines_text { background: url(); } #mines_text { background: #f9f9f999; } .advisor_hint { background: url(); } .advisor_hint { background: #f9f9f999; } .background_light { background: url(); } .background_light { background: #f9f9f999; } .message_poster.message_partner { background: #f4f58cb3; } .message_poster { background: #97aaf899; } #message_forward_body { background: url(); } .game_list_footer { background: url(); } .game_list_footer { background: #f9f9f999; } .game_inner_box .game_footer { background: url(); } .game_inner_box .game_footer { background: #f9f9f999; } #rb_wall2 { background: #f9f9f999; } #rb_wall1 { background: #f9f9f999; } #rb_fs1 { background: #f9f9f999; } #rb_fs2 { background: #f9f9f999; } #rb_fs3 { background: #f9f9f999; } #rb_fs4 { background: #f9f9f999; } .published_report .report_units_overview { background: #f9f9f999; } .attack_spots .attacking_units .curtain_box .cb_bg { background: url(); } .attack_spots .attacking_units .cb_bg, .attack_spots .defending_units .cb_bg { background: url(); } .curtain_box .cb_bg { background: #f9f9f999; } .message_item.odd.bottom.ui-draggable { background: linear-gradient(to right,rgba(107, 249, 65, 0.67),rgba(249, 248, 101, 0.42)); } .message_item.even.ui-draggable.top { background: linear-gradient(to right,rgba(223, 70, 238, 0.67),rgba(249, 101, 101, 0.42)); } </style>').appendTo("head");
                }
                //Christmas
                if (DATA.options.joe_tg) {
                    $('<style id="joe_Scrollbar"> .passwordRecovery.ng-scope.ui-draggable {margin-left: 700px; margin-top: 9px; background-color: #9effedb8;} .botSettings { background-color: #aaf0aa87;} .free.ui-draggable:hover { background-color: #87aedf69;} .botSettings.ui-draggable.ng-scope { background-color: #aaf0aa87;} .ui-draggable:hover { background-color: #87aedf69;} .window.ng-scope.ui-draggable { background: rgba(100, 180, 220, 0.59);} .border-ornament.border-ornament-middle { background: url(https://i.imgur.com/FjV2mqh.png) no-repeat 0 0; height: 62px; width: 350px; filter: drop-shadow(6px 6px 36px #ff042e) hue-rotate(-10deg); left: 30%;} #mmo12_award_container { background: url(https://i.imgur.com/FjV2mqh.png) no-repeat 0 0; height: 92px; width: 350px; position: absolute; top: -60px; right: -100px; z-index: 2; filter: drop-shadow(6px 6px 36px #ff042e) hue-rotate(-10deg);} #content { background: #0000000f;} #trade_tab .content { background: #ffffff8a url(https://i.imgur.com/BCUgYDS.gif);} .forum_thread_unread { border: solid 3px #f3ff00; border-radius: 50%;} .thread_important_closed { box-shadow: -3px 3px 1px red;} .thread_closed { box-shadow: -3px 3px 1px red;} .forum_thread_important_unread { border: solid 3px #00fffa; border-radius: 50%;} .forum_thread_important_read { box-shadow: -3px 3px 1px #f3ff00;} .forum_thread_read { box-shadow: -3px 3px 1px #f3ff00;} .thread_important_closed_unread { border: solid 3px #00fffa; border-radius: 50%;} .thread_closed_unread { border: solid 3px #00fffa; border-radius: 50%;} .bold { font-weight: 800; font-family: cursive; filter: drop-shadow(1px 1px 1px #000);} .classic_window .filler{ background: url(https://i.imgur.com/lt4HQo1.gif) 0px 0px; background-size:150%; } div.gpwindow_content { background: url(https://i.imgur.com/lt4HQo1.gif) 0px 0px; background-size:150%; } .box.middle.center{ background: url(https://i.imgur.com/lt4HQo1.gif) 0px 0px; background-size:230%; filter: drop-shadow(1px 1px 1px #000);} .popup_middle_middle { background: url(https://i.imgur.com/ce0ofcU.png) 0px 0px; background-size:50%; font-weight: bold; filter: drop-shadow(1px 1px 1px #000);} .popup_table_inside { background: url(https://i.imgur.com/lt4HQo1.gif) 0px 0px; background-size:150%; filter: drop-shadow(1px 1px 1px #000);} .bbcode_box.middle_center { background: url(https://i.imgur.com/lt4HQo1.gif) 0px 0px; background-size:150%; } .town_infos { background: url(); } .ph_order_info { background-image: url(https://i.imgur.com/UeJePkL.png); } #unit_order_ph_background { position: absolute; width: 446px; height: 92px; left: 0; bottom: 0; background-image: url(https://i.imgur.com/59sARoR.png); } #buildings .building {  position: relative; background: url(https://i.imgur.com/Mgnaxc0.png) no-repeat 0 0; } #unit_order div.unit_order_tab { background: url(https://i.imgur.com/LFlptUN.png) 0 0 no-repeat; } #ally_pact_list { background-Color: #FFFAFA00; } #ally_flags .game_body{ background: url(https://i.imgur.com/JQZLJNN.png) } #message_partner {background: url(); } .barracks.window_background { background: url() } .game_body { background: url() } #unit_order_values td { background-color: #fffafa80 } #unit_order_unit_info td { background-color: #fffafa80 } .docks.window_background { background: url() } .city_overview_building.ship_1 { background: url(https://i.imgur.com/TtrpoYQ.png)no-repeat; width: 210px; height: 140px;  } .window_storage_wrapper .storage_window_background { background: url() } .marketplace .marketplace_window_background { background: url() } .odd { background: url(https://i.imgur.com/ce0ofcU.png); } .farm_window_background { background: url() } .game_list .even { background: url(); background-color: #00000054; } .main_window_background { background: url() } .place_window_background { background: url() } .place_simulator_even, .place_simulator_even2 { background: url(); background-color: #9ab3f042; } .place_simulator_odd, .place_simulator_odd2 { background: url(); background-color: #9ab3f042; } .academy .academy_image { background: url() } .storage_resbar_title.bold { color: white; } .academy .tech_tree_box .column { background: url() } .academy .tech_tree_box .column.inactive { background: url(https://i.imgur.com/bWJBd1I.png) } .construction_queue_sprite { background: url(https://i.imgur.com/0dPgTlH.png) } .grepo-frame .frame-content { background: url(https://i.imgur.com/JQZLJNN.png) } .various_orders_queue .various_orders_middle { background: url(https://i.imgur.com/Vjh5FgH.png) repeat 0 0; opacity: 0.6; } .stoner_window_background { background: url(https://i.imgur.com/ce0ofcU.png) } .ironer_window_background { background: url() } #mines_text { background: url(https://i.imgur.com/JQZLJNN.png) } #mines_values tr.even { background: url(https://i.imgur.com/JQZLJNN.png) } #mines_values tr.odd { background: url(https://i.imgur.com/JQZLJNN.png) } .game_list_footer { background: url(https://i.imgur.com/JQZLJNN.png) } .game_inner_box .game_footer { background: url(https://i.imgur.com/JQZLJNN.png) } .god_selection .background { background: url() } .advisor_hint { background: url(https://i.imgur.com/JQZLJNN.png) } .game_list .odd { background: url(https://lesamisdumoulindecitole.files.wordpress.com/2016/11/neige-01.gif); background-size: 800px 454px; } .wall_window_background { background: url() } .hide_window_wrapper .hide_window_background { background: url() } .brown { background: url(https://i.imgur.com/JQZLJNN.png) } .game_table_odd { background: url() } .game_table td { border-bottom: 1px solid #fff9 } .reservation_tool .gp_tab_page { background: url() } #message_message, #message_new_message { background-image: url(https://i.imgur.com/ce0ofcU.png); font-family: "Comic Sans MS", cursive, serif; font-weight: bold; } .message_post_content { background: url() } .message_post { background: url(https://i.imgur.com/JQZLJNN.png) } #folder_toggle_menu { background: url(https://i.imgur.com/JQZLJNN.png) } .alliance_link, a { color: #fff; } #overviews_link_hover_menu .subsection.disabled li a { color: #fff; } .top_description { color: #fff; } p { color: #fff; background-image: url(https://i.imgur.com/q2OOkL5.png); background-color: #0a0a0a21; background-repeat: no-repeat;} i { color: #fff; } h5 { color: #fff; } li { color: #fff; filter: drop-shadow(1px 1px 1px #000); } h2 { color: white; } h3 { color: #fff; } h4 { color: #fff; } .tcol1 { color: #fff; } .tcol2 { color: #fff; } .tcol3 { color: #fff; } .tcol4 { color: #fff; } .reservation.no_results { color: #fff; } .reservation_tool .reservations_list .header div { border-bottom: 2px solid #fff; } b { color: #fff; filter: drop-shadow(1px 1px 1px #000); } label { color: #fff; } strong { color: #fff; } .content { color: #fff; max-width: 57em; overflow: hidden; box-shadow: 0 .25em .9em #CCC,inset 0 0 1em .25em #CCC; font-family: "Comic Sans MS", cursive, serif; font-weight: bold; color: ivory;} #message_new_preview_body { color: #fff; font-family: "Comic Sans MS", cursive, serif; font-weight: bold; } #create_list_name_form { color: #fff; } .level.number { color: #fff; } .game_body { color: #fff; } div.advisor_hint .pf_bonus { color: #fff; } #mines_text { color: #fff; } td { color: #fff; filter: drop-shadow(1px 1px 1px #000);} .preview_box { color: #fff; } .message_post_content { color: #fff; font-family: "Comic Sans MS", cursive, serif; font-weight: bold; max-width: 57em; margin: 1em auto 2em; overflow: hidden; box-shadow: 0 .25em .9em #FFF,inset 0 0 1em .25em #A29E9E;} div.bbcodes_spoiler_text { background-color: #0009; } div.quote div.quote_message { background-color: #b2b2b280; font-size: 8pt; margin-top: 0; padding: 2px 3px; } #custom_map_color_background{ background: url(https://i.imgur.com/RXg9l4S.png) } #town_group_active_towns, #town_group_all_towns { background: url(https://i.imgur.com/jpmek8l.png) 0 0 no-repeat; background-position-x: 0px; background-position-y: 0px; background-position-x: 0px;  background-position-y: -120px; } div.group_list_scroll_border{ background: url() } .game_table{ background: url() } .box.middle.center div.box_content { background: #01010187; } .notes .window_content .notes_container textarea { background: #fffafaa3; font-family: "Comic Sans MS", cursive, serif; font-weight: bold;} #edit_profile_form textarea, #player_settings .list_item_right fieldset { background-Color: #FFFAFA7d; } #awards_visibility_all_wrapper, #awards_visibility_ally_wrapper, #awards_visibility_player_wrapper {background: url(); background-color: #00000061; } .questlog_index .quest.selected { background: url(https://i.imgur.com/JQZLJNN.png) } .report_units_overview { background: url() } .report_booty_bonus_fight { background: url(https://i.imgur.com/JQZLJNN.png) } #ally_profile_info #ally_pacts, #ally_profile_info #ally_profile { background: url(https://i.imgur.com/JQZLJNN.png) } #ally_towns .members_list { background: url(https://i.imgur.com/JQZLJNN.png) } #ally_towns .members_list li.even, #ally_towns .members_list li.header, #ally_towns .members_list li.odd { border-bottom: 1px solid #127213 } #ally_towns .members_list li.header { background: url(https://i.imgur.com/JQZLJNN.png) } div.island_info_towns ul { background: url(https://i.imgur.com/JQZLJNN.png) } #island_towns_controls { background: url(https://i.imgur.com/JQZLJNN.png) } .ui_construction_queue .construction_queue_frame .queue_BG_slice-middle { background: url(https://i.imgur.com/ZsPEHJG.png) } #towninfo_description { background-color: #fff0; background-image: url(https://i.imgur.com/jpmek8l.png); opacity: 0.9; }.town_cast_spell_oldcontent { background: #fff0 !important; opacity: 0.9; background-image: url(https://i.imgur.com/jpmek8l.png); } .city_overview_building.field_3 { background: url(https://i.imgur.com/QANAOvr.png) } .attack_planner.attacks .attacks_list { background: url(); background-color: #00000038; } .attack_planner li.selected { background-color: #40c43399 } .attack_planner.show_plan .attacks_list li.selected { background-color: #40c43399 } .lumber_window_background { background: url(https://i.imgur.com/ce0ofcU.png) } .published_report .espionage_report, .published_report .power_report { background: #fff6; overflow: hidden; padding-bottom: 5px; } .published_report .report_units_overview { height: auto; width: 100%; background: #0000009c; position: relative; } .colA0A0FF  { background: #9E9EF999; } #message_reply_message { background: #FFFAFA7d; font-family: "Comic Sans MS", cursive, serif; font-weight: bold; } .report_units_overview { background-color: #0070ff54; } .headline { color: #fff; } .second_headline { color: #fff; } .sandy-box .corner_bl, .sandy-box .corner_br, .sandy-box .corner_tl, .sandy-box .corner_tr { opacity: 0.8; } .sandy-box .border_b, .sandy-box .border_t { opacity: 0.8; } .sandy-box .border_l, .sandy-box .border_r { opacity: 0.8; } .sandy-box .middle { opacity: 0.8; } .marketplace.all_offers tr:nth-child(2n):not(.premium_exchange), .marketplace.own_offers tr:nth-child(2n):not(.premium_exchange) {  background: url() repeat 0 0; background-color: #0009; } .marketplace.all_offers table, .marketplace.own_offers table { background: url() repeat 0 0; background-color: #fff9; } div.bbcodes_spoiler_text { background-color: #beffb999;} #building_overview tr td.locked { background-color: #beffb999;} #newthread { padding: 0; background: transparent url() repeat scroll 0 0; height: 374px; } #newthread #bbcodes { border-bottom: 1px solid #ffffff80; border-top: 1px solid #ffffff80; background: transparent url(https://i.imgur.com/JQZLJNN.png) repeat scroll 0 0; position: relative; height: 24px; padding: 5px; } #forum_post_textarea.newthread { height: 299px; width: 100%;  margin: 4px 0; opacity: 0.7; } #forum_post_textarea.newpoll { height: 215px; width: 100%; margin: 4px 0; background: #fffafa80; } #forum_admin .forum.odd .name .text_box { background: transparent url() repeat scroll 0 0; } #forum_admin .forum.even .name .text_box { background: transparent url() repeat scroll 0 0; } .forum_toggle #toggle { border-left: 1px solid #d0be97; float: right; padding: 4px; padding-bottom: 4px; width: 120px; margin-bottom: -50px; padding-bottom: 50px; background: url() repeat scroll 0 0 transparent; } #premium_overview_inner { background: url() repeat scroll 0 0 transparent; overflow-x: hidden; overflow-y: auto; height: 361px; } .settings-container #player_settings { position: relative; color: white; } #post_save_wrapper { height: 193px; background: #ffffff80 url() repeat scroll 0 0; } .forum_toggle { border-bottom: 1px solid #d0be97; background: transparent url(https://i.imgur.com/JQZLJNN.png) repeat scroll 0 0; overflow: hidden; height: 24px; position: relative; } #message_reply_preview { background: url(https://i.imgur.com/JQZLJNN.png)repeat scroll 0 0 transparent; } li.found_post div.post_text { background-color: #dfeee000;} .even { background: url() repeat 0 0; border-bottom: 2px solid #fff; border-bottom-width: 2px; } div.quote div.quote_author { font-weight: 700; font-size: 8pt; margin-bottom: 0; background-color: #f8d17d99; } .fight_report_classic { opacity: 0.8; } .reservation.even { background-color: #fff6; } .reservation.odd { background-color: #fff3; } .dropdown_list_square .content .option.selected, .dropdown_list_square .content .option:hover { background: url(https://i.imgur.com/JQZLJNN.png) repeat 0 0; background-color: #fff900b3; } .ac_results { background: url(https://i.imgur.com/JQZLJNN.png); } .ac_odd.ac_over { background-color: #fff900cc; } .ac_even.ac_over { background-color: #fff900cc; } .ac_odd { background: url(https://i.imgur.com/JQZLJNN.png) repeat; } .ac_even { background: url(https://i.imgur.com/JQZLJNN.png) repeat; } .cell_casted_powers { background-color: #b6f6b366; } #trade_selected { background: url(); } #trade_selected { background-color: #586e5c99; } #ranking_search_info { background: url() repeat scroll 0 0; } #ranking_search_info { background-color: #fbff0099; } .game_list li { padding: 4px 2px; border-bottom: 1px solid #fff9; } #premium_overview_text_area { color: white; } .message_date { color: #fffffeb3; } legend { color: white; } .published_report_header { border-bottom: 1px solid #ca8; padding: 4px; background-color: #6a624c; } .postcount { color: white; } center { color: white; } .small { color: white; } #forum_description { color: white; } #thread_functions { display: none; overflow: visible; height: 0; background: transparent url(https://i.imgur.com/JQZLJNN.png) repeat scroll 0 0; border-bottom: 1px solid #d0be97; position: absolute; z-index: 90; left: 0; right: 0; } .control { background: #ccc6; } .background_light { background: url(https://i.imgur.com/JQZLJNN.png) repeat 0 0; } .description.description_viewport.background_default.border_orange.scrollbar_not_active { background: #ccc6; } .info_text.runtime_time { color: white; } .info_text.arrival_at { color: white; } .info_text.research_espionage_bonus_text { color: white; } .way_duration { color: white; } .arrival_time { color: white; } .max_booty.storage_icon { color: white; } .slow_boats_needed { color: white; } .fast_boats_needed { color: white; } .fight_bonus.morale { color: white; filter: drop-shadow(1px 1px 1px #000); } .fight_bonus { filter: drop-shadow(1px 1px 1px #000); } .no_results { color: white; } span.fp_loot_text { color: white; } .islandinfo_coords { color: white; filter: drop-shadow(0px 1px 0px #000); font-family: "Comic Sans MS", cursive, serif; font-weight: bold; } .islandinfo_free { color: white; filter: drop-shadow(0px 1px 0px #000); font-family: "Comic Sans MS", cursive, serif; font-weight: bold;} #fto_town_list li.fto_island { background: url(https://i.imgur.com/JQZLJNN.png) repeat; } #fto_town_list { min-height: 405px; max-height: 405px; overflow-y: auto; overflow-x: hidden; background: url() 0 0 repeat; background-color: #ccc6; cursor: pointer; } .js-caption { color: white; } .farm_town .action_wrapper .trading_wrapper .bpv_ratio_text { font-weight: 600; color: #fff; position: absolute; top: 62px; left: 298px; } .tooltip_reward_day .reward_wrapper { background: url() repeat scroll 0 0 transparent; margin: 15px 5px auto; border: 1px solid #c3a56199; } .farm_town .action_wrapper .trading_wrapper { background: url(https://i.imgur.com/fv1gsvn.png) no-repeat 0 -396px; width: 635px; height: 184px; position: absolute; top: 32px; left: 43px; text-align: center; } .question { color: white; } .additional_question { color: white; } .cbx_caption { color: white; } .captain_commercial .message { min-height: 64px; background-color: #ffe4b199; margin: 0 70px 0 0; overflow: hidden; position: relative; } .option.js-option { color: black; } .scroll { background: #0000001a; } .italic { color: white; } #place_culture_bg { position: relative; background-image: url(https://i.imgur.com/hH9NzQ8.png); width: 690px; height: 52px; bottom: 0; left: 21px; margin-bottom: 10px; padding: 3px; } #culture_overview_towns div.celebration_button, #culture_overview_towns div.celebration_icon, #culture_overview_towns div.celebration_icon_bg, #culture_overview_towns div.celebration_name, #culture_overview_towns div.celebration_progressbar, #culture_overview_towns div.celebration_progressbar div, #hides_overview_towns div.help_button, #hides_overview_towns div.hide_icon, #hides_overview_towns div.hide_icon_bg, #hides_overview_towns div.hide_progressbar, #hides_overview_towns div.hide_progressbar div, #hides_overview_towns div.iron_name { background-image: url(https://i.imgur.com/7OeZOK3.png); position: absolute; } #town_group_overview_head { color: white; filter: drop-shadow(1px 1px 1px #000); } #farm_report_form .game_table th, #resource_transport_report_form .game_table th { color: #fff; } .description { color: white; } .effect.background_light { color: white; } .requirement.background_light { color: white; } .title { color: white; } .clearfix { color: white; } .message_poster.small.message_partner { background: url(https://steamuserimages-a.akamaihd.net/ugc/856107890641379877/AB76F4D4AEDEF269798542FFD65E1E775433CD38/); background-position: 0px 340px; } .message_poster.small { background-color: #a09c9c5e; } .item.town_group_town, .sandy-box .item, .sandy-box .item_no_results { color: #fff; } #units .max { color: #fff; } .game_inner_box .game_body2 { background: url() repeat; padding: 3px 6px 3px 6px; } .tooltip_with_arrow .twa_background_fake { background: url(https://i.imgur.com/JQZLJNN.png) repeat 0 0; } #folder_menu_messages { background: transparent url() repeat scroll 0 0; } .table_box .table_box_content .body { background: url(); } .option.js-option { color: white; } .storage_resbar { background: url(https://i.imgur.com/SijS8ct.png) no-repeat; } #recipient_list_form_1 { color: white; } #popup_div_curtain { color: white; } #folder_menu_reports { background: url(); } #recipient_list_form_1 { color: white; } .inner_recipient_list { border-bottom: 1px solid #fff; } .main_ranking.brown_header_light tbody tr:nth-child(2n+1) { background: url() repeat 0 0; } .main_ranking.brown_header_light tbody tr:nth-child(2n) { background: url() repeat 0 0; } .main_ranking.brown_header_light tbody tr:nth-child(2n) { background: #0000005e; } .main_ranking.brown_header_light tbody tr:nth-child(2n).highlight, .main_ranking.brown_header_light tbody tr:nth-child(2n+1).highlight { background-color: #55fc4569; 0 0; } .noquest_description { color: white; } .timer { color: white; } .special_buildings_image { opacity: 0.9; } #premium_exchange { opacity: 0.9; } #casted_power_reports { color: white; } .nightbonus { color: white; } .task_description { color: white; } #trade_tab { color: white; } .grepo_box .grepo_box_background, .grepo_box > .background  { background: url(); background-color: #00000087; } .grepo_curtain .middle  { background: url(); } .grepo_curtain .left, .grepo_curtain .middle, .grepo_curtain .right  { background: url(); } .building_overview #building_overview td.building.hover, .building_overview #building_overview tr:hover {  background: #9ba0ff73; } #townsoverview .game_list li:hover { background-image: url(); } #townsoverview .game_list li:hover { background-color: #9ba0ff73; } .hepler_row { background: #262c4073; } .info_dialog.info_create_first_town_group { color: white; } #recruit_overview .unit_queue.unknown_transparent { border: 1px solid #ffffffa3; color: #ffffffa3; } div.trade_town { background: url(https://i.imgur.com/JZPEp90.png) 0 0 no-repeat; } .trade_town_wrapper { background: url(https://i.imgur.com/JZPEp90.png) right -125px no-repeat; } .alliance_link, a { color: #fff; transition-duration: 0.5s; transition-timing-function: ease-in; transition-property: all; } .game_table_odd { background-color: #0000005C; } .game_table_even.bottom { background: url(); background-color: #0000007d;} .color_highlight, .item_selected  { background-color: #00ff0421; } .gp_link_fake { color: #fff; filter: drop-shadow(1px 1px 1px #000); } .domination_peace_wrapper { color: white; } .domination_peace_wrapper { background: #262c403b; } .inventory .inventory_bg { background-image: url(https://i.imgur.com/0G3IzlZ.png); } .notes .window_content .notes_container .preview_box { background: url(); background-Color: #ffffff63; font-family: "Comic Sans MS", cursive, serif; font-weight: bold; box-shadow: 0 .25em .9em #FFF,inset 0 0 1em .25em #A29E9E;} .god_info_box { background: #262c403b; } .attack_spots .attacking_units .cb_bg, .attack_spots .defending_units .cb_bg { background: url();background-color: #f6d59080; } .attack_spots .attacking_units .curtain_box .cb_bg { background: url();background-color: #f6d59080; } textarea { background: #04040400; } .grepo-frame .frame-content { background: url(); background-color: #0003; } .farm_towns.lvl_0 .actions .action_wrapper .bpv_trade_illustration { background: url(); background-color: #0000006e;} .farm_towns.lvl_0 .actions .action_wrapper { background: url(); background-color: #0000008a; } #ally_finder_text tr:first-child { background-color: #849eeda3; } .checkbox_description { color: white; } .descr { color: white; } #outer_troops_box .outer_troops_sort_box { background: url(); background-Color: #00000075 ; } .attack_spots .reward_title { color: #fff; } .bpv_trade_description { color: white; } .bpv_trade_title { color: white; } .classic_window.heroes_train .heroes_train .middle_border { background: url(); background-color: #00000091; } .classic_window.heroes_train .heroes_train .inner_border { background: url(); background-color: #0000008a; } .academy .research_points_box { background-image: url(https://i.imgur.com/Y4iUo71.png); } #place_culture_in_progress { color: white;} #place_culture_level { color: white;} #place_culture_towns { color: white;} .heroes_council .council_info .description { color: #fff; } .reward_scroll_large .scroll_left { background-image: url(https://i.imgur.com/eOSAZc1.png); } .reward_scroll_large .scroll_middle { background-image: url(https://i.imgur.com/XfAjRQr.png); } .reward_scroll_large .scroll_right { background-image: url(https://i.imgur.com/XeyRALH.png); } .domination .domination_info .info_wrapper .domination_rule_wrapper .rules { background: url(https://steamuserimages-a.akamaihd.net/ugc/856107890641379877/AB76F4D4AEDEF269798542FFD65E1E775433CD38/); } .table_box .table_box_content .content_box { background: url(https://steamuserimages-a.akamaihd.net/ugc/856107890641379877/AB76F4D4AEDEF269798542FFD65E1E775433CD38/); } .attack_support_window .troops_from_this_town { background: url(https://steamuserimages-a.akamaihd.net/ugc/856107890641379877/AB76F4D4AEDEF269798542FFD65E1E775433CD38/); } .questlog_index .island_quests .questgiver.question_mark { background: url(https://i.imgur.com/0awzuQk.png) no-repeat -700px -33px; width: 46px; height: 46px;} #forum_admin div.game_list_footer, #thread_list_form #forum div.game_list_footer { background: url(https://i.imgur.com/JQZLJNN.png); } #forum div.game_list_footer { background: url(https://i.imgur.com/JQZLJNN.png); } #alliance_properties_wrapper fieldset { background: url(https://i.imgur.com/JQZLJNN.png); } #awards_visibility_all, #awards_visibility_ally, #awards_visibility_player { background: url(); } #award_visibility_world_form, #award_visibility_world_selection { color: white; } #overviews_link_hover_menu .subsection { background-color: #00000063; } #announcement_list .message_subject { color: #ffb200; } #ally_members table { background-color: #7881f645; } div.gpwindow_content { color: white; } .game_list.fto_farm_list { background-image: url(https://i.imgur.com/stFjggm.png); } .island_info_wrapper { background-color: #0000008a; background-image: url(https://i.imgur.com/lxR0MPh.png); } #unit_order div.unit_active { background: url(https://i.imgur.com/LFlptUN.png) 0 0 no-repeat;  background-position: -58px 0; } #culture_points_overview_bottom { background-image: url(https://i.imgur.com/nK8eIMN.png); background-color: #00000075; } #gods_overview_bottom { background-image: url(https://i.imgur.com/nK8eIMN.png); background-color: #00000075; } #hides_overview_bottom { background-image: url(https://i.imgur.com/nK8eIMN.png); background-color: #00000075; } #outer_troops { background-image: url(https://i.imgur.com/nK8eIMN.png); background-color: #00000075; height: 50px; } .god_selection #temple_gods { background: url(https://i.imgur.com/xUroKua.png) no-repeat -995px 0; } .temple_gods_large { background-image: url(https://i.imgur.com/AQAHoVM.png); } .power_icon86x86 { filter: drop-shadow(0px 0px 14px #ffe404); } .hero70x70.godsent, .unit_icon70x70 { filter: drop-shadow(0px 0px 14px #ffe404); } #temple_priest_hint .advisor_hint { filter: drop-shadow(0px 0px 14px #ffe404); } a.unit, div.unit { filter: drop-shadow(0px 0px 14px #ffe404); } .power_icon45x45 { filter: drop-shadow(0px 0px 14px #ffe404); } #unit_order_box { filter: drop-shadow(0px 0px 14px #ffe404);} #unit_order_values { filter: drop-shadow(0px 0px 14px #ffe404);} #unit_order_unit_info { filter: drop-shadow(0px 0px 14px #ffe404);} .grepo-frame .frame-content { filter: drop-shadow(0px 0px 4px #ffe404);} .report_town_bg { filter: drop-shadow(0px 0px 14px #ffe404);} .res_background { filter: drop-shadow(0px 0px 14px #ffe404);} #buildings { filter: drop-shadow(0px 0px 14px #ffe404);} .academy .tech_tree_box .research_box { filter: drop-shadow(0px 0px 8px #ffe404);} .classic_window .window_content .game_border, .new_tab_fake .game_border { filter: drop-shadow(0px 0px 14px #ffe404);} #unit_order_ph_background { filter: drop-shadow(0px 0px 20px #ffe404);} #ph_trader_image { background-image: url(https://i.imgur.com/z3NGLS6.png); filter: drop-shadow(0px 0px 14px #ffe404);} .ph_order_info { filter: drop-shadow(0px 0px 14px #ffe404); } .heroes .locations .btn_hero_not_assigned, .heroes .locations .btn_hero_unassign, .heroes .locations .btn_recruit { filter: drop-shadow(0px 0px 5px #ffe404);} .heroes .btn_buy_premium_slot, .heroes .slot_choice { filter: drop-shadow(0px 0px 14px #ffe404);} .instant_buy .hero_slot .info .pb_exp, .instant_buy .hero_slot .info .pb_on_the_way_town, .instant_buy .hero_slot .info .pb_regeneration, .instant_buy .hero_slot .info .pb_transfer_to_game, .instant_buy .hero_slot .info .pb_transfer_to_master { filter: drop-shadow(0px 0px 5px #ffe404);} .instant_buy .hero_slot .info .btn_send_resources { filter: drop-shadow(0px 0px 14px #ffe404);} .heroes_council .btn_call_for_gold { filter: drop-shadow(0px 0px 5px #ffe404);} .heroes_council .available_heroes .hire_hero { filter: drop-shadow(0px 0px 14px #ffe404);} .grepo_box .grepo_box_content, .grepo_box > .content {filter: drop-shadow(0px 0px 10px #ffe404);} a.button:link, a.button:visited { filter: drop-shadow(0px 0px 10px#ffe404);} .button_new { filter: drop-shadow(0px 0px 10px #ffe404);} .game_list#culture_overview_towns li, .game_list#gods_overview_towns li, .game_list#hides_overview_towns li, .game_list#trade_overview_towns li { filter: drop-shadow(0px 0px 10px #ffe404);} .tg_town_draggable, .town_draggable { filter: drop-shadow(0px 0px 10px #ffe404);} #gods_overview_towns .town_item, #unit_overview_town_list .town_item { filter: drop-shadow(0px 0px 14px #ffe404);} .textbox { filter: drop-shadow(0px 0px 14px #ffe404);} .trade_town_wrapper { filter: drop-shadow(0px 0px 10px #ffe404);} .grepo-frame .frame-border-left, .grepo-frame .frame-border-right { background: url(https://i.imgur.com/NKj0goC.gif) repeat-y 0 0; background-size: 6px; transform: rotate(180deg);} .grepo-frame .frame-border-bottom, .grepo-frame .frame-border-top { background: url(https://i.imgur.com/1Lgg1Gl.gif) repeat-x 0 0; background-size: 180px;} div.game_border_top { background: url(https://i.imgur.com/1Lgg1Gl.gif) repeat-x top center; background-size: 190px;} div.game_border_bottom { background: url(https://i.imgur.com/1Lgg1Gl.gif) repeat-x bottom center; background-size: 190px;} div.game_border_right { background: url(https://i.imgur.com/NKj0goC.gif) repeat-y right center; background-size: 6px;} div.game_border_left { background: url(https://i.imgur.com/NKj0goC.gif) repeat-y left center; background-size: 6px;} .classic_window .window_content .game_border .game_border_top, .new_tab_fake .game_border .game_border_top { background: url(https://i.imgur.com/1Lgg1Gl.gif) repeat-x top center; background-size: 190px;} .classic_window .window_content .game_border .game_border_bottom, .new_tab_fake .game_border .game_border_bottom { background: url(https://i.imgur.com/1Lgg1Gl.gif) repeat-x bottom center; background-size: 190px;} #temple_favor_bar .progressbar_time_and_value .info { color: #fff;} .marketplace.all_offers tr, .marketplace.own_offers tr { background-color: #00000057;} .attack_support_window .attack_table_box .attack_content .attack_strategy, .attack_support_window .attack_table_box .attack_content .attack_type { filter: drop-shadow(0px 0px 14px #ffe404);} academy .tech_tree_box .bar_wrapper .bar { background-color: #33aa35;} #content_text { color: white;} #fto_town_list li.fto_town.active, div.fto_time_checkbox.active { background: linear-gradient(to right, #80ff0042, #d5f6d4a1); border-right: 4px solid #ffd700;} .marketplace.create_offer .section.market_offer { background: url(https://i.imgur.com/gENHpfQ.png) no-repeat -20px 0;} .filler.window_background { background: #00000012; background-image: url(https://i.imgur.com/ce0ofcU.png);} .storage_full_at { color: white;} #iron_done_in { color: white;} #stone_done_in { color:  white;} #wood_done_in { color: white;} #farm_report_form, #report_form { background: #00000012;} .game_border { background: #000000a3; background-image: url(https://i.imgur.com/ce0ofcU.png);} .settings-container { background-image: url(https://i.imgur.com/ce0ofcU.png);} .wall_report_unit.unit_icon50x50 { filter: drop-shadow(0px 0px 8px #ffe404);} #content_main { background: #000000b8; } .attack_type32x32.attack_land { filter: drop-shadow(0px 0px 5px #47ff04);} .attack_type32x32.support { filter: drop-shadow(0px 0px 5px #ffb300);} .attack_type32x32.revolt_running {filter: drop-shadow(0px 0px 8px #f00);} .attack_type32x32.revolt_arising {filter: drop-shadow(0px 0px 8px #00ffe7);} .attack_type32x32.attack_takeover {filter: drop-shadow(0px 0px 8px #d300ff);} .attack_type32x32.attack { filter: drop-shadow(0px 0px 8px#1400ff);} #unit_order_values td { background-color: #00fc1b2b;} #unit_order_unit_info td { background-color: #00fc1b2b;} .ui_various_orders { background-color: #00fc1b2b;} #premium_overview_inner {height: 447px;} .attack_planner .bar_top { background: url();} .attack_planner .details_container { background: url();} .attack_planner .town_box .town_name_box { background-color: #00000040;} .attack_planner .units_box td { background-color: #0000004a;} .attack_planner.show_plan .attacks_row { background-color: #60c43357;} .even.attacks_row { background-color: #91c61b3b;} .gp_window.classic_sub_window > .background { background: url(https://i.imgur.com/ce0ofcU.png); background-position-y: 200px;} textarea { background-image: url(); font-family: "Comic Sans MS", cursive, serif; font-weight: bold; } .ratio_heading.label.trade_offer { color: white} .marketplace.create_offer .tbl_offer_settings { color: #fff;} .captain_commercial .message { background-color: #93fa8b66;} .attack_planner.attacks li { background-color:#60c43357;} .customization .content { background: #f7f57b4a; background-image: url(https://i.imgur.com/ce0ofcU.png);} .customization .tabs .tab { background: #fffb00bf; background-image: url(https://i.imgur.com/ce0ofcU.png);} #last_attacks { background-image: url(https://i.imgur.com/ce0ofcU.png); background: #00000036;} img { filter: drop-shadow(0px 0px 15px #00ffe7);} #farm_town_overview_btn { filter: drop-shadow(0px 0px 8px #ff00fb);} .count.small { filter: drop-shadow(0px 1px 0px #000);} .blessed_tab_content { opacity: 0.8;} .dropdown-list.default { background-color: #ffefca61;} .daily_login_wrapper { opacity: 0.8;} .description.background_default.border_orange { background-image: url();} .fto_time_checkbox { background: linear-gradient(to right, #f006, #ffffffa1);} .quest_expiration { color: #fb8383;} .grepolis_score .score_content li.award_group:nth-child(2n) { background-color: #92e5fe12;} .grepolis_score .score_content li.award_group:nth-child(2n+1) { background-color: #92e5fe40;} .grepolis_score .header { opacity: 0.8;} .island_quest_details .decision_container .teaser { text-align: left; color: #fc6; width: 135px; overflow: hidden; position: absolute; top: 50px; padding: 0 10px; margin-left: -40px;} .island_quest_details .decision_container .info_icon { margin: 5px 0 0 30px;} .island_quest_details .banner.red .left, .island_quest_details .banner.red .right {  margin-top: 11px;} .island_quest_details .banner.red .middle { margin-top: 11px;} .island_quest_details .banner.blue .left, .island_quest_details .banner.blue .right {  margin-top: 11px;} .island_quest_details .banner.blue .middle { margin-top: 11px;} .button_buret { height: 56px;} .button_buret:hover { height: 56px;} .button_buret:active { height: 56px;} .button_buret.disabled { height: 56px;} .advisors_container .top_description { filter: drop-shadow(1px 1px 1px #000);} .checkbox_description { filter: drop-shadow(1px 1px 1px#000);} #premium_overview_text_area { filter: drop-shadow(1px 1px 1px #000);} .academy .tech_tree_box .bar_wrapper .bar { background-color: #00ff02b0;} a.button .middle { line-height: 22px; min-width: 70px;} .ui_city_overview .city_overview_overlay .build_button { filter: drop-shadow(0px 0px 3px #00ff1c);} .bbcode_box.content.clearfix { background-image: url(https://i.imgur.com/ce0ofcU.png);} .middle.nui_main_menu.container_hidden { height: 0px;} .nui_units_box .bottom { background: url(https://gppt.innogamescdn.com/images/game/autogenerated/layout/layout_d1cf0d4.png) no-repeat 500px 500px;  width: 142px;} #MHbbcpreview { color: #ffffff85;} </style>').appendTo("head");
                }
                //Buraco
                if (DATA.options.joe_th) {
                    $('<style id="joe_Scrollbar">.classic_window .filler{ background: url(https://i.imgur.com/COC81LP.gif) 0px -100px; background-size:100%; } div.gpwindow_content { background: url(https://i.imgur.com/COC81LP.gif) 0px -100px; background-size:100%; } .box.middle.center{ background: url(https://i.imgur.com/COC81LP.gif) -20px 0px; background-size:130%; } .popup_middle_middle { background: url(https://i.imgur.com/COC81LP.gif) 0px 0px; background-size:100%; } .popup_table_inside { background: url(https://i.imgur.com/COC81LP.gif) 0px 0px; background-size:100%; } .bbcode_box.middle_center { background: url(https://i.imgur.com/COC81LP.gif); background-size:100%; } .town_infos { background: url(); } .gods_area .gods_container.god { background-image: url(https://i.imgur.com/2IF58W5.png); } #temple_god_static { background-image: url(https://i.imgur.com/HhG3qIW.png); } .god_mini { background-image: url(https://i.imgur.com/LNptz3f.png); } .ph_order_info { background-image: url(https://i.imgur.com/UeJePkL.png); } #unit_order_ph_background { position: absolute; width: 446px; height: 92px; left: 0; bottom: 0; background-image: url(https://i.imgur.com/59sARoR.png); } #buildings .building {position: relative; background: url(https://i.imgur.com/Mgnaxc0.png) no-repeat 0 0; } #unit_order div.unit_order_tab { background: url(https://i.imgur.com/LFlptUN.png) 0 0 no-repeat; } #ally_pact_list { background-Color: #FFFAFA00; } #ally_flags .game_body{ background: url(https://i.imgur.com/JQZLJNN.png) } #message_partner {background: url(); } .barracks.window_background { background: url() } .game_body { background: url() } #unit_order_values td { background-color: #fffafa80 } #unit_order_unit_info td { background-color: #fffafa80 } .docks.window_background { background: url() } .city_overview_building.ship_1 { background: url(https://i.imgur.com/TtrpoYQ.png)no-repeat; width: 210px; height: 140px;} .window_storage_wrapper .storage_window_background { background: url() } .marketplace .marketplace_window_background { background: url() } .odd { background: url(https://i.imgur.com/JQZLJNN.png); border-bottom: 2px solid #fff; } .farm_window_background { background: url() } .game_list .even { background: url() } .game_list .even { background-color: #7675758f; } .main_window_background { background: url() } .place_window_background { background: url() } .place_simulator_even, .place_simulator_even2 { background: url(https://i.imgur.com/JQZLJNN.png) } .place_simulator_odd, .place_simulator_odd2 { background: url(https://i.imgur.com/JQZLJNN.png) } .academy .academy_image { background: url() } .academy .tech_tree_box .column { background: url() } .academy .tech_tree_box .column.inactive { background: url(https://i.imgur.com/bWJBd1I.png) } .construction_queue_sprite { background: url(https://i.imgur.com/0dPgTlH.png) } .grepo-frame .frame-content { background: url(https://i.imgur.com/JQZLJNN.png) } .various_orders_queue .various_orders_middle { background: url(https://i.imgur.com/Vjh5FgH.png) repeat 0 0; opacity: 0.6; } .stoner_window_background { background: url() } .ironer_window_background { background: url() } #mines_text { background: url(https://i.imgur.com/JQZLJNN.png) } #mines_values tr.even { background: url(https://i.imgur.com/JQZLJNN.png) } #mines_values tr.odd { background: url(https://i.imgur.com/JQZLJNN.png) } .game_list_footer { background: url(https://i.imgur.com/JQZLJNN.png) } .game_inner_box .game_footer { background: url(https://i.imgur.com/JQZLJNN.png) } .god_selection .background { background: url() } .advisor_hint { background: url(https://i.imgur.com/JQZLJNN.png) } .game_list .odd { background: url(https://i.imgur.com/JQZLJNN.png) } .wall_window_background { background: url() } .hide_window_wrapper .hide_window_background { background: url() } .brown { background: url(https://i.imgur.com/JQZLJNN.png) } .game_table_odd { background: url() } .game_table td { border-bottom: 1px solid #fff9 } .reservation_tool .gp_tab_page { background: url() } #message_message, #message_new_message { background-Color: #fffafaa3; } .message_post_content { background: url() } .message_post { background: url(https://i.imgur.com/JQZLJNN.png) } #folder_toggle_menu { background: url(https://i.imgur.com/JQZLJNN.png) } .alliance_link, a { color: #fff; } #overviews_link_hover_menu .subsection.disabled li a { color: #fff; } .top_description { color: #fff; } p { color: #fff; } i { color: #fff; } h5 { color: #fff; } li { color: #fff; } h3 { color: #fff; } h4 { color: #fff; } .tcol1 { color: #fff; } .tcol2 { color: #fff; } .tcol3 { color: #fff; } .tcol4 { color: #fff; } .reservation.no_results { color: #fff; } .reservation_tool .reservations_list .header div { border-bottom: 2px solid #fff; } b { color: #fff; } b { color: #fff; } label { color: #fff; } strong { color: #fff; } .content { color: #fff; } #message_new_preview_body { color: #fff; } #create_list_name_form { color: #fff; } .level.number { color: #fff; } .game_body { color: #fff; } div.advisor_hint .pf_bonus { color: #fff; } #mines_text { color: #fff; } td { color: #fff; } .preview_box { color: #fff; } .message_post_content { color: #fff; } div.bbcodes_spoiler_text { background-color: #fff; padding-top: 3px; margin: 3px 0 0 0; } div.quote div.quote_message { background-color: #b2b2b280; font-size: 8pt; margin-top: 0; padding: 2px 3px; } #custom_map_color_background{ background: url(https://i.imgur.com/RXg9l4S.png) } #town_group_active_towns, #town_group_all_towns{ background: url() } #town_group_active_towns, #town_group_all_towns{ background-color: #fff3; } div.group_list_scroll_border{ background: url() } .game_table{ background: url() } .box.middle.center div.box_content { background: #ffffff87; } .notes .window_content .notes_container textarea { background: #fffafaa3; } #edit_profile_form textarea, #player_settings .list_item_right fieldset { background-Color: #FFFAFA7d; } #awards_visibility_all, #awards_visibility_ally, #awards_visibility_player { background: url(https://i.imgur.com/IATpjbE.png) } #awards_visibility_all_wrapper, #awards_visibility_ally_wrapper, #awards_visibility_player_wrapper { background: url(https://i.imgur.com/IATpjbE.png) } .questlog_index .quest.selected { background: url(https://i.imgur.com/JQZLJNN.png) } .report_units_overview { background: url() } .report_booty_bonus_fight { background: url(https://i.imgur.com/JQZLJNN.png) } #ally_profile_info #ally_pacts, #ally_profile_info #ally_profile { background: url(https://i.imgur.com/JQZLJNN.png) } #ally_towns .members_list { background: url(https://i.imgur.com/JQZLJNN.png) } #ally_towns .members_list li.even, #ally_towns .members_list li.header, #ally_towns .members_list li.odd { border-bottom: 1px solid #127213 } #ally_towns .members_list li.header { background: url(https://i.imgur.com/JQZLJNN.png) } div.island_info_towns ul { background: url(https://i.imgur.com/JQZLJNN.png) } #island_towns_controls { background: url(https://i.imgur.com/JQZLJNN.png) } #trade_tab .content { background: #ffffff8a url(https://i.imgur.com/BCUgYDS.gif); } .ui_construction_queue .construction_queue_frame .queue_BG_slice-middle { background: url(https://i.imgur.com/ZsPEHJG.png) } #towninfo_description { background-color: #ccc6 }.town_cast_spell_oldcontent { background: #ccc6 !important; } .city_overview_building.field_3 { background: url(https://i.imgur.com/QANAOvr.png) } .attack_planner.attacks .attacks_list { background: url(https://i.imgur.com/JQZLJNN.png) } .attack_planner li.selected { background-color: #40c43399 } .attack_planner.show_plan .attacks_list li.selected { background-color: #40c43399 } .lumber_window_background { background: url() } .published_report .espionage_report, .published_report .power_report { background: #fff6; overflow: hidden; padding-bottom: 5px; } .published_report .report_units_overview { height: auto; width: 100%; background: #0000009c; position: relative; } .colA0A0FF{ background: #9E9EF999; } #message_reply_message { background: #FFFAFA7d; } .report_units_overview { background-color: #8e8e91; } .headline { color: #fff; } .second_headline { color: #fff; } .sandy-box .corner_bl, .sandy-box .corner_br, .sandy-box .corner_tl, .sandy-box .corner_tr { opacity: 0.8; } .sandy-box .border_b, .sandy-box .border_t { opacity: 0.8; } .sandy-box .border_l, .sandy-box .border_r { opacity: 0.8; } .sandy-box .middle { opacity: 0.8; } .marketplace.all_offers tr:nth-child(2n):not(.premium_exchange), .marketplace.own_offers tr:nth-child(2n):not(.premium_exchange) {background: url() repeat 0 0; background-color: #0009; } .marketplace.all_offers table, .marketplace.own_offers table { background: url() repeat 0 0; background-color: #fff9; } div.bbcodes_spoiler_text { background-color: #beffb999;} #building_overview tr td.locked { background-color: #beffb999;} #newthread { padding: 0; background: transparent url(https://i.imgur.com/JQZLJNN.png) repeat scroll 0 0; height: 374px; } #newthread #bbcodes { border-bottom: 1px solid #ffffff80; border-top: 1px solid #ffffff80; background: transparent url(https://i.imgur.com/JQZLJNN.png) repeat scroll 0 0; position: relative; height: 24px; padding: 5px; } #forum_post_textarea.newthread { height: 299px; width: 100%;margin: 4px 0; opacity: 0.7; } #forum_post_textarea.newpoll { height: 215px; width: 100%; margin: 4px 0; background: #fffafa80; } #forum_admin .forum.odd .name .text_box { background: transparent url() repeat scroll 0 0; } #forum_admin .forum.even .name .text_box { background: transparent url() repeat scroll 0 0; } .forum_toggle #toggle { border-left: 1px solid #d0be97; float: right; padding: 4px; padding-bottom: 4px; width: 120px; margin-bottom: -50px; padding-bottom: 50px; background: url() repeat scroll 0 0 transparent; } #premium_overview_inner { background: url() repeat scroll 0 0 transparent; overflow-x: hidden; overflow-y: auto; height: 361px; } .settings-container #player_settings { position: relative; color: white; } #post_save_wrapper { height: 193px; background: #ffffff80 url() repeat scroll 0 0; } .forum_toggle { border-bottom: 1px solid #d0be97; background: transparent url(https://i.imgur.com/JQZLJNN.png) repeat scroll 0 0; overflow: hidden; height: 24px; position: relative; } #message_reply_preview { background: url(https://i.imgur.com/JQZLJNN.png)repeat scroll 0 0 transparent; } li.found_post div.post_text { background-color: #dfeee000;} .even { background: url() repeat 0 0; border-bottom: 2px solid #fff; border-bottom-width: 2px; } div.quote div.quote_author { font-weight: 700; font-size: 8pt; margin-bottom: 0; background-color: #f8d17d99; } .fight_report_classic { opacity: 0.8; } .reservation.even { background-color: #fff6; } .reservation.odd { background-color: #fff3; } .dropdown_list_square .content .option.selected, .dropdown_list_square .content .option:hover { background: url(https://i.imgur.com/JQZLJNN.png) repeat 0 0; background-color: #fff900b3; } .ac_results { background: url(https://i.imgur.com/JQZLJNN.png); } .ac_odd.ac_over { background-color: #fff900cc; } .ac_even.ac_over { background-color: #fff900cc; } .ac_odd { background: url(https://i.imgur.com/JQZLJNN.png) repeat; } .ac_even { background: url(https://i.imgur.com/JQZLJNN.png) repeat; } .cell_casted_powers { background-color: #b6f6b366; } #trade_selected { background: url(); } #trade_selected { background-color: #586e5c99; } #ranking_search_info { background: url() repeat scroll 0 0; } #ranking_search_info { background-color: #fbff0099; } .game_list li { padding: 4px 2px; border-bottom: 1px solid #fff9; } #premium_overview_text_area { color: white; } .message_date { color: #fffffeb3; } legend { color: white; } .published_report_header { border-bottom: 1px solid #ca8; padding: 4px; background-color: #6a624c; } .postcount { color: white; } center { color: white; } .small { color: white; } #forum_description { color: white; } #thread_functions { display: none; overflow: visible; height: 0; background: transparent url(https://i.imgur.com/JQZLJNN.png) repeat scroll 0 0; border-bottom: 1px solid #d0be97; position: absolute; z-index: 90; left: 0; right: 0; } .control { background: #ccc6; } .background_light { background: url(https://i.imgur.com/JQZLJNN.png) repeat 0 0; } .description.description_viewport.background_default.border_orange.scrollbar_not_active { background: #ccc6; } .info_text.runtime_time { color: white; } .info_text.arrival_at { color: white; } .info_text.research_espionage_bonus_text { color: white; } .way_duration { color: white; } .arrival_time { color: white; } .max_booty.storage_icon { color: white; } .slow_boats_needed { color: white; } .fast_boats_needed { color: white; } .fight_bonus.morale { color: white; } .no_results { color: white; } span.fp_loot_text { color: white; } .islandinfo_coords { color: white; } .islandinfo_free { color: white; } #fto_town_list li.fto_island { background: url(https://i.imgur.com/JQZLJNN.png) repeat; } #fto_town_list { min-height: 405px; max-height: 405px; overflow-y: auto; overflow-x: hidden; background: url() 0 0 repeat; background-color: #ccc6; cursor: pointer; } #fto_town_list li.fto_town.active, div.fto_time_checkbox.active { background: #232423b3; } .js-caption { color: white; } .farm_town .action_wrapper .trading_wrapper .bpv_ratio_text { font-weight: 600; color: #fff; position: absolute; top: 62px; left: 298px; } .tooltip_reward_day .reward_wrapper { background: url() repeat scroll 0 0 transparent; margin: 15px 5px auto; border: 1px solid #c3a56199; } .farm_town .action_wrapper .trading_wrapper { background: url(https://i.imgur.com/fv1gsvn.png) no-repeat 0 -396px; width: 635px; height: 184px; position: absolute; top: 32px; left: 43px; text-align: center; } .question { color: white; } .additional_question { color: white; } .cbx_caption { color: white; } .captain_commercial .message { min-height: 64px; background-color: #ffe4b199; margin: 0 70px 0 0; overflow: hidden; position: relative; } .option.js-option { color: black; } .scroll { background: #0000001a; } .italic { color: white; } .bold { color: white; } #place_culture_bg { position: relative; background-image: url(https://i.imgur.com/hH9NzQ8.png); width: 690px; height: 52px; bottom: 0; left: 21px; margin-bottom: 10px; padding: 3px; } #culture_overview_towns div.celebration_button, #culture_overview_towns div.celebration_icon, #culture_overview_towns div.celebration_icon_bg, #culture_overview_towns div.celebration_name, #culture_overview_towns div.celebration_progressbar, #culture_overview_towns div.celebration_progressbar div, #hides_overview_towns div.help_button, #hides_overview_towns div.hide_icon, #hides_overview_towns div.hide_icon_bg, #hides_overview_towns div.hide_progressbar, #hides_overview_towns div.hide_progressbar div, #hides_overview_towns div.iron_name { background-image: url(https://i.imgur.com/7OeZOK3.png); position: absolute; } #town_group_overview_head { color: white; } #farm_report_form .game_table th, #resource_transport_report_form .game_table th { color: #fff; } .description { color: white; } .effect.background_light { color: white; } .requirement.background_light { color: white; } .title { color: white; } span { color: white; } .clearfix { color: white; } .message_poster.small.message_partner { background-color: #dbffda5c; } .message_poster.small { background-color: #a09c9c5e; } .item.town_group_town, .sandy-box .item, .sandy-box .item_no_results { color: #fff; } #units .max { color: #fff; } .game_inner_box .game_body2 { background: url() repeat; padding: 3px 6px 3px 6px; } .tooltip_with_arrow .twa_background_fake { background: url(https://i.imgur.com/JQZLJNN.png) repeat 0 0; } #folder_menu_messages { background: transparent url() repeat scroll 0 0; } .table_box .table_box_content .body { background: url(); } .option.js-option { color: white; } .storage_resbar { background: url(https://i.imgur.com/SijS8ct.png) no-repeat; } #recipient_list_form_1 { color: white; } #popup_div_curtain { color: white; } #folder_menu_reports { background: url(); } #recipient_list_form_1 { color: white; } .inner_recipient_list { border-bottom: 1px solid #fff; } .main_ranking.brown_header_light tbody tr:nth-child(2n+1) { background: url() repeat 0 0; } .main_ranking.brown_header_light tbody tr:nth-child(2n) { background: url() repeat 0 0; } .main_ranking.brown_header_light tbody tr:nth-child(2n) { background: #0000005e; } .main_ranking.brown_header_light tbody tr:nth-child(2n).highlight, .main_ranking.brown_header_light tbody tr:nth-child(2n+1).highlight { background-color: #55fc4569; 0 0; } .noquest_description { color: white; } .timer { color: white; } .special_buildings_image { opacity: 0.5; } .section.even.market_offer { opacity: 0.8; } #premium_exchange { opacity: 0.8; } #casted_power_reports { color: white; } .nightbonus { color: white; } .task_description { color: white; } #trade_tab { color: white; } .grepo_box .grepo_box_background, .grepo_box > .background{ background: url(); } .grepo_curtain .middle{ background: url(); } .grepo_curtain .left, .grepo_curtain .middle, .grepo_curtain .right{ background: url(); } .building_overview #building_overview td.building.hover, .building_overview #building_overview tr:hover {background: #9ba0ff73; } #townsoverview .game_list li:hover { background-image: url(); } #townsoverview .game_list li:hover { background-color: #9ba0ff73; } .hepler_row { background: #262c4073; } .info_dialog.info_create_first_town_group { color: white; } #recruit_overview .unit_queue.unknown_transparent { border: 1px solid #ffffffa3; color: #ffffffa3; } div.trade_town { background: url(https://i.imgur.com/JZPEp90.png) 0 0 no-repeat; } .trade_town_wrapper { background: url(https://i.imgur.com/JZPEp90.png) right -125px no-repeat; } .alliance_link, a { color: #fff; transition-duration: 0.5s; transition-timing-function: ease-in; transition-property: all; } .game_table_even.bottom { background: url(https://i.imgur.com/JQZLJNN.png); } .game_table_odd { background-color: #7675758f } .color_highlight, .item_selected{ background-color: #9ba0ff73 } .gp_link_fake { color: ##fffc; } .description { background: #262c403b; } .domination_peace_wrapper { color: white; } .domination_peace_wrapper { background: #262c403b; } .inventory .inventory_bg { background-image: url(https://i.imgur.com/0G3IzlZ.png); } .notes .window_content .notes_container .preview_box { background: url(); background-Color: #ffffff63; } .god_info_box { background: #262c403b; } .attack_spots .attacking_units .cb_bg, .attack_spots .defending_units .cb_bg { background: url();background-color: #f6d59080; } .attack_spots .attacking_units .curtain_box .cb_bg { background: url();background-color: #f6d59080; } textarea { background: #ffffff82; } .grepo-frame .frame-content { background: url(); background-color: #0003; } .farm_towns.lvl_0 .actions .action_wrapper .bpv_trade_illustration { background: url(); background-color: #0000006e;} .farm_towns.lvl_0 .actions .action_wrapper { background: url(); background-color: #0000008a; } #ally_finder_text tr:first-child { background-color: #849eeda3; } .checkbox_description { color: white; } .descr { color: white; } #outer_troops_box .outer_troops_sort_box { background: url(); background-Color: #00000075 ; } .attack_spots .reward_title { color: #fff; } .bpv_trade_description { color: white; } .bpv_trade_title { color: white; } .classic_window.heroes_train .heroes_train .middle_border { background: url(); background-color: #00000091; } .classic_window.heroes_train .heroes_train .inner_border { background: url(); background-color: #0000008a; } .academy .research_points_box { background-image: url(https://i.imgur.com/Y4iUo71.png); } </style>').appendTo("head");
                }
                //Abes
                if (DATA.options.joe_ti) {
                    $('<style id="joe_Scrollbar">.bold{font-weight:800;font-family:cursive}.questlog_index .island_quests .questgiver.question_mark{background:url(https://i.imgur.com/0awzuQk.png) no-repeat -700px -33px;width:46px;height:46px}.classic_window .filler{background:url(https://i.imgur.com/kAiyRLQ.gif) 0 0;background-size:100%}div.gpwindow_content{background:url(https://i.imgur.com/kAiyRLQ.gif) 0 0;background-size:100%}.box.middle.center{background:url(https://i.imgur.com/kAiyRLQ.gif) -120px 0;background-size:200%}.popup_middle_middle{background:url(https://i.imgur.com/kAiyRLQ.gif) 0 0;background-size:100%}.popup_table_inside{background:url(https://i.imgur.com/kAiyRLQ.gif) 0 0;background-size:100%}.bbcode_box.middle_center{background:url(https://i.imgur.com/kAiyRLQ.gif) 0 0;background-size:100%}.town_infos{background:url()}.gods_area .gods_container.god{background-image:url(https://i.imgur.com/2IF58W5.png)}#temple_god_static{background-image:url(https://i.imgur.com/HhG3qIW.png)}.god_mini{background-image:url(https://i.imgur.com/LNptz3f.png)}.ph_order_info{background-image:url(https://i.imgur.com/UeJePkL.png)}#unit_order_ph_background{position:absolute;width:446px;height:92px;left:0;bottom:0;background-image:url(https://i.imgur.com/59sARoR.png)}#buildings .building{position:relative;background:url(https://i.imgur.com/Mgnaxc0.png) no-repeat 0 0}#unit_order div.unit_order_tab{background:url(https://i.imgur.com/LFlptUN.png) 0 0 no-repeat}#ally_pact_list{background-Color:#FFFAFA00}#ally_flags .game_body{background:url(https://i.imgur.com/JQZLJNN.png)}#message_partner{background:url()}.barracks.window_background{background:url()}.game_body{background:url()}#unit_order_values td{background-color:#fffafa80}#unit_order_unit_info td{background-color:#fffafa80}.docks.window_background{background:url()}.city_overview_building.ship_1{background:url(https://i.imgur.com/TtrpoYQ.png)no-repeat;width:210px;height:140px}.window_storage_wrapper .storage_window_background{background:url()}.marketplace .marketplace_window_background{background:url()}.odd{background:url()}.farm_window_background{background:url()}.game_list .even{background:url()}.game_list .even{background-color:#7675758f}.main_window_background{background:url()}.place_window_background{background:url()}.place_simulator_even,.place_simulator_even2{background:url(https://i.imgur.com/JQZLJNN.png)}.place_simulator_odd,.place_simulator_odd2{background:url(https://i.imgur.com/JQZLJNN.png)}.academy .academy_image{background:url()}.academy .tech_tree_box .column{background:url()}.academy .tech_tree_box .column.inactive{background:url(https://i.imgur.com/bWJBd1I.png)}.construction_queue_sprite{background:url(https://i.imgur.com/0dPgTlH.png)}.grepo-frame .frame-content{background:url(https://i.imgur.com/JQZLJNN.png)}.various_orders_queue .various_orders_middle{background:url(https://i.imgur.com/Vjh5FgH.png) repeat 0 0;opacity:.6}.stoner_window_background{background:url()}.ironer_window_background{background:url()}#mines_text{background:url(https://i.imgur.com/JQZLJNN.png)}#mines_values tr.even{background:url(https://i.imgur.com/JQZLJNN.png)}#mines_values tr.odd{background:url(https://i.imgur.com/JQZLJNN.png)}.game_list_footer{background:url(https://i.imgur.com/JQZLJNN.png)}.game_inner_box .game_footer{background:url(https://i.imgur.com/JQZLJNN.png)}.god_selection .background{background:url()}.advisor_hint{background:url(https://i.imgur.com/JQZLJNN.png)}.game_list .odd{background:url()}.wall_window_background{background:url()}.hide_window_wrapper .hide_window_background{background:url()}.brown{background:url(https://i.imgur.com/JQZLJNN.png)}.game_table_odd{background:url()}.game_table td{border-bottom:1px solid #fff9}.reservation_tool .gp_tab_page{background:url()}#message_message,#message_new_message{background-Color:#fffafaa3}.message_post_content{background:url()}.message_post{background:url(https://i.imgur.com/JQZLJNN.png)}#folder_toggle_menu{background:url(https://i.imgur.com/JQZLJNN.png)}.alliance_link,a{color:#fff}#overviews_link_hover_menu .subsection.disabled li a{color:#fff}.top_description{color:#fff}p{color:#fff}i{color:#fff}h5{color:#fff}h3{color:#fff}h4{color:#fff}.tcol1{color:#fff}.tcol2{color:#fff}.tcol3{color:#fff}.tcol4{color:#fff}.reservation.no_results{color:#fff}.reservation_tool .reservations_list .header div{border-bottom:2px solid #fff}b{color:#fff}b{color:#fff}label{color:#fff}strong{color:#fff}.content{color:#fff}#message_new_preview_body{color:#fff}#create_list_name_form{color:#fff}.level.number{color:#fff}.game_body{color:#fff}div.advisor_hint .pf_bonus{color:#fff}#mines_text{color:#fff}td{color:#fff}.preview_box{color:#fff}.message_post_content{color:#fff}div.bbcodes_spoiler_text{background-color:#fff;padding-top:3px;margin:3px 0 0 0}div.quote div.quote_message{background-color:#b2b2b280;font-size:8pt;margin-top:0;padding:2px 3px}#custom_map_color_background{background:url(https://i.imgur.com/RXg9l4S.png)}#town_group_active_towns,#town_group_all_towns{background:url(https://i.imgur.com/JQZLJNN.png)}#town_group_active_towns,#town_group_all_towns{background-color:#fff3}div.group_list_scroll_border{background:url()}.game_table{background:url()}.box.middle.center div.box_content{background:#ffffff87}.notes .window_content .notes_container textarea{background:#fffafaa3}#edit_profile_form textarea,#player_settings .list_item_right fieldset{background-Color:#FFFAFA7d}#awards_visibility_all,#awards_visibility_ally,#awards_visibility_player{background:url(https://i.imgur.com/JQZLJNN.png)}#awards_visibility_all_wrapper,#awards_visibility_ally_wrapper,#awards_visibility_player_wrapper{background:url()}.questlog_index .quest.selected{background:url(https://i.imgur.com/JQZLJNN.png)}.report_units_overview{background:url()}.report_booty_bonus_fight{background:url(https://i.imgur.com/JQZLJNN.png)}#ally_profile_info #ally_pacts,#ally_profile_info #ally_profile{background:url(https://i.imgur.com/JQZLJNN.png)}#ally_towns .members_list{background:url(https://i.imgur.com/JQZLJNN.png)}#ally_towns .members_list li.even,#ally_towns .members_list li.header,#ally_towns .members_list li.odd{border-bottom:1px solid #127213}#ally_towns .members_list li.header{background:url(https://i.imgur.com/JQZLJNN.png)}div.island_info_towns ul{background:url(https://i.imgur.com/JQZLJNN.png)}#island_towns_controls{background:url(https://i.imgur.com/JQZLJNN.png)}#trade_tab .content{background:url(https://i.imgur.com/JQZLJNN.png)}.ui_construction_queue .construction_queue_frame .queue_BG_slice-middle{background:url(https://i.imgur.com/ZsPEHJG.png)}#towninfo_description{background-color:#ccc6}.town_cast_spell_oldcontent { background: #ccc6 !important; }.city_overview_building.field_3{background:url(https://i.imgur.com/QANAOvr.png)}.attack_planner.attacks .attacks_list{background:url(https://i.imgur.com/JQZLJNN.png)}.attack_planner li.selected{background-color:#40c43399}.attack_planner.show_plan .attacks_list li.selected{background-color:#40c43399}.lumber_window_background{background:url()}.published_report .espionage_report,.published_report .power_report{background:#fff6;overflow:hidden;padding-bottom:5px}.published_report .report_units_overview{height:auto;width:100%;background:#0000009c;position:relative}.colA0A0FF{background:#9E9EF999}#message_reply_message{background:#FFFAFA7d}.report_units_overview{background-color:#8e8e91}.second_headline{color:#fff}.sandy-box .corner_bl,.sandy-box .corner_br,.sandy-box .corner_tl,.sandy-box .corner_tr{opacity:.8}.sandy-box .border_b,.sandy-box .border_t{opacity:.8}.sandy-box .border_l,.sandy-box .border_r{opacity:.8}.sandy-box .middle{opacity:.8}.marketplace.all_offers tr:nth-child(2n):not(.premium_exchange),.marketplace.own_offers tr:nth-child(2n):not(.premium_exchange){background:url() repeat 0 0;background-color:#0009}.marketplace.all_offers table,.marketplace.own_offers table{background:url() repeat 0 0;background-color:#0000007a}div.bbcodes_spoiler_text{background-color:#beffb999}#building_overview tr td.locked{background-color:#beffb999}#newthread{padding:0;background:transparent url(https://i.imgur.com/JQZLJNN.png) repeat scroll 0 0;height:374px}#newthread #bbcodes{border-bottom:1px solid #ffffff80;border-top:1px solid #ffffff80;background:transparent url(https://i.imgur.com/JQZLJNN.png) repeat scroll 0 0;position:relative;height:24px;padding:5px}#forum_post_textarea.newthread{height:299px;width:100%;margin:4px 0;opacity:.7}#forum_post_textarea.newpoll{height:215px;width:100%;margin:4px 0;background:#fffafa80}#forum_admin .forum.odd .name .text_box{background:transparent url() repeat scroll 0 0}#forum_admin .forum.even .name .text_box{background:transparent url() repeat scroll 0 0}.forum_toggle #toggle{border-left:1px solid #d0be97;float:right;padding:4px;padding-bottom:4px;width:120px;margin-bottom:-50px;padding-bottom:50px;background:url() repeat scroll 0 0 transparent}#premium_overview_inner{background:url() repeat scroll 0 0 transparent;overflow-x:hidden;overflow-y:auto;height:361px}.settings-container #player_settings{position:relative;color:white}#post_save_wrapper{height:193px;background:#ffffff80 url() repeat scroll 0 0}.forum_toggle{border-bottom:1px solid #d0be97;background:transparent url(https://i.imgur.com/JQZLJNN.png) repeat scroll 0 0;overflow:hidden;height:24px;position:relative}#message_reply_preview{background:url(https://i.imgur.com/JQZLJNN.png)repeat scroll 0 0 transparent}li.found_post div.post_text{background-color:#dfeee000}.even{background:url() repeat 0 0;border-bottom:2px solid #fff;border-bottom-width:2px}div.quote div.quote_author{font-weight:700;font-size:8pt;margin-bottom:0;background-color:#f8d17d99}.fight_report_classic{opacity:.8}.reservation.even{background-color:#fff6}.reservation.odd{background-color:#fff3}.dropdown_list_square .content .option.selected,.dropdown_list_square .content .option:hover{background:url(https://i.imgur.com/JQZLJNN.png) repeat 0 0;background-color:#fff900b3}.ac_results{background:url(https://i.imgur.com/JQZLJNN.png)}.ac_odd.ac_over{background-color:#fff900cc}.ac_even.ac_over{background-color:#fff900cc}.ac_odd{background:url(https://i.imgur.com/JQZLJNN.png) repeat}.ac_even{background:url(https://i.imgur.com/JQZLJNN.png) repeat}.cell_casted_powers{background-color:#b6f6b366}#trade_selected{background:url()}#trade_selected{background-color:#586e5c99}#ranking_search_info{background:url() repeat scroll 0 0}#ranking_search_info{background-color:#fbff0099}.game_list li{padding:4px 2px;border-bottom:1px solid #fff9}#premium_overview_text_area{color:white}.message_date{color:#fffffeb3}legend{color:white}.published_report_header{border-bottom:1px solid #ca8;padding:4px;background-color:#6a624c}.postcount{color:white}center{color:white}.small{color:white}#forum_description{color:white}#thread_functions{display:none;overflow:visible;height:0;background:transparent url(https://i.imgur.com/JQZLJNN.png) repeat scroll 0 0;border-bottom:1px solid #d0be97;position:absolute;z-index:90;left:0;right:0}.control{background:#ccc6}.background_light{background:url(https://i.imgur.com/JQZLJNN.png) repeat 0 0}.description.description_viewport.background_default.border_orange.scrollbar_not_active{background:#ccc6}.info_text.runtime_time{color:white}.info_text.arrival_at{color:white}.info_text.research_espionage_bonus_text{color:white}.max_booty.storage_icon{color:white}.slow_boats_needed{color:white}.fast_boats_needed{color:white}.fight_bonus.morale{color:white}.no_results{color:white}span.fp_loot_text{color:white}.islandinfo_coords{color:white}.islandinfo_free{color:white}#fto_town_list li.fto_island{background:url(https://i.imgur.com/JQZLJNN.png) repeat}#fto_town_list{min-height:405px;max-height:405px;overflow-y:auto;overflow-x:hidden;background:url() 0 0 repeat;background-color:#ccc6;cursor:pointer}#fto_town_list li.fto_town.active,div.fto_time_checkbox.active{background:#232423b3}.js-caption{color:white}.farm_town .action_wrapper .trading_wrapper .bpv_ratio_text{font-weight:600;color:#fff;position:absolute;top:62px;left:298px}.tooltip_reward_day .reward_wrapper{background:url() repeat scroll 0 0 transparent;margin:15px 5px auto;border:1px solid #c3a56199}.farm_town .action_wrapper .trading_wrapper{background:url(https://i.imgur.com/fv1gsvn.png) no-repeat 0 -396px;width:635px;height:184px;position:absolute;top:32px;left:43px;text-align:center}.question{color:white}.additional_question{color:white}.cbx_caption{color:white}.captain_commercial .message{min-height:64px;background-color:#ffe4b199;margin:0 70px 0 0;overflow:hidden;position:relative}.scroll{background:#0000001a}.italic{color:white}#place_culture_bg{position:relative;background-image:url(https://i.imgur.com/hH9NzQ8.png);width:690px;height:52px;bottom:0;left:21px;margin-bottom:10px;padding:3px}#culture_overview_towns div.celebration_button,#culture_overview_towns div.celebration_icon,#culture_overview_towns div.celebration_icon_bg,#culture_overview_towns div.celebration_name,#culture_overview_towns div.celebration_progressbar,#culture_overview_towns div.celebration_progressbar div,#hides_overview_towns div.help_button,#hides_overview_towns div.hide_icon,#hides_overview_towns div.hide_icon_bg,#hides_overview_towns div.hide_progressbar,#hides_overview_towns div.hide_progressbar div,#hides_overview_towns div.iron_name{background-image:url(https://i.imgur.com/7OeZOK3.png);position:absolute}#town_group_overview_head{color:white}#farm_report_form .game_table th,#resource_transport_report_form .game_table th{color:#fff}.description{color:white}.effect.background_light{color:white}.requirement.background_light{color:white}.title{color:white}.clearfix{color:white}.message_poster.small.message_partner{background-color:#dbffda5c}.message_poster.small{background-color:#a09c9c5e}.item.town_group_town,.sandy-box .item,.sandy-box .item_no_results{color:#fff}#units .max{color:#fff}.game_inner_box .game_body2{background:url() repeat;padding:3px 6px 3px 6px}.tooltip_with_arrow .twa_background_fake{background:url(https://i.imgur.com/JQZLJNN.png) repeat 0 0}#folder_menu_messages{background:transparent url() repeat scroll 0 0}.table_box .table_box_content .body{background:url()}.storage_resbar{background:url(https://i.imgur.com/SijS8ct.png) no-repeat}#recipient_list_form_1{color:white}#popup_div_curtain{color:white}#folder_menu_reports{background:url()}#recipient_list_form_1{color:white}.inner_recipient_list{border-bottom:1px solid #fff}.main_ranking.brown_header_light tbody tr:nth-child(2n+1){background:url() repeat 0 0}.main_ranking.brown_header_light tbody tr:nth-child(2n){background:url() repeat 0 0}.main_ranking.brown_header_light tbody tr:nth-child(2n){background:#0000005e}.main_ranking.brown_header_light tbody tr:nth-child(2n).highlight,.main_ranking.brown_header_light tbody tr:nth-child(2n+1).highlight{background-color:#55fc4569;0 0}.noquest_description{color:white}.timer{color:white}.special_buildings_image{opacity:.5}#premium_exchange{opacity:.8}#casted_power_reports{color:white}.nightbonus{color:white}.task_description{color:white}#trade_tab{color:white}.grepo_box .grepo_box_background,.grepo_box>.background{background:url()}.grepo_curtain .middle{background:url()}.grepo_curtain .left,.grepo_curtain .middle,.grepo_curtain .right{background:url()}.building_overview #building_overview td.building.hover,.building_overview #building_overview tr:hover{background:#9ba0ff73}#townsoverview .game_list li:hover{background-image:url()}#townsoverview .game_list li:hover{background-color:#9ba0ff73}.hepler_row{background:#262c4073}.info_dialog.info_create_first_town_group{color:white}#recruit_overview .unit_queue.unknown_transparent{border:1px solid #ffffffa3;color:#ffffffa3}div.trade_town{background:url(https://i.imgur.com/JZPEp90.png) 0 0 no-repeat}.trade_town_wrapper{background:url(https://i.imgur.com/JZPEp90.png) right -125px no-repeat}.alliance_link,a{color:#fff;transition-duration:.5s;transition-timing-function:ease-in;transition-property:all}.color_highlight,.item_selected{background-color:#9ba0ff73}.gp_link_fake{color:##fffc}.description{background:#262c403b}.domination_peace_wrapper{color:white}.domination_peace_wrapper{background:#262c403b}.inventory .inventory_bg{background-image:url(https://i.imgur.com/0G3IzlZ.png)}.notes .window_content .notes_container .preview_box{background:url();background-Color:#ffffff63}.god_info_box{background:#262c403b}.attack_spots .attacking_units .cb_bg,.attack_spots .defending_units .cb_bg{background:url();background-color:#f6d59080}.attack_spots .attacking_units .curtain_box .cb_bg{background:url();background-color:#f6d59080}textarea{background:#ffffff82}.grepo-frame .frame-content{background:url();background-color:#0003}.farm_towns.lvl_0 .actions .action_wrapper .bpv_trade_illustration{background:url();background-color:#0000006e}.farm_towns.lvl_0 .actions .action_wrapper{background:url();background-color:#0000008a}#ally_finder_text tr:first-child{background-color:#849eeda3}.checkbox_description{color:white}.descr{color:white}#outer_troops_box .outer_troops_sort_box{background:url();background-Color:#00000075}.bpv_trade_description{color:white}.bpv_trade_title{color:white}.classic_window.heroes_train .heroes_train .middle_border{background:url();background-color:#00000091}.classic_window.heroes_train .heroes_train .inner_border{background:url();background-color:#0000008a}.academy .research_points_box{background-image:url(https://i.imgur.com/Y4iUo71.png)}.ranking_table table{background-color:#00000061}.duration_error_text{color:white}#place_culture_in_progress{color:white}#place_culture_level{color:white}#place_culture_towns{color:white}.game_table_odd{background-color:#3eff0030}#recruit_overview .open_barracks_window,#recruit_overview .open_harbor_window{color:#fff}.label{color:white}.attack_spots .reward_title{color:white}.odd{color:white}.list_item_left{color:white}.even.reservation_tool{color:white}.headline{color:white}.even.bottom{color:white}.unit_order_total{color:white}.marketplace.create_offer .section.market_offer{background:url(https://i.imgur.com/gENHpfQ.png) no-repeat -20px 0}th{color:white}.storage_full_at{color:white}.even{color:white}#stone_done_in{color:white}#iron_done_in{color:white}#wood_done_in{color:white}.es_last_page{color:white}#award_visibility_world_form{color:white}#award_visibility_default_visibility_form{color:white}#player_settings:hover{background-color:#423f3b70}.storage_resbar_title.bold{color:white}div.quote div.quote_message{background-color:#5e6aa880}.RepConvMsg{color:white}.pages{color:white}#publish_report_options2:hover{background-color:#2d2b2b5c}#publish_report_options1:hover{background-color:#2d2b2b5c}#report_date{float:left;animation:fadeInOutIn 3s ease infinite;color:#fff300;filter:drop-shadow(3px 3px 2px #35ff04) hue-rotate(-10deg)}#report_date:hover{animation-duration:0s}#report_game_body{background-color:#00000069}.place_box{color:white}.ally_bbcode{color:white}.fto_time_checkbox.fto_1200{background:#232423b3}.fto_time_checkbox.fto_5400{background:#232423b3}.fto_time_checkbox.fto_14400{background:#232423b3}#place_battle_points .points_descr,#place_start_all .bold{color:white}div.dialog_buttons{color:white}.heroes_council .council_info .description{color:#fff}.quest_expiration{color:white}.way_duration{color:white}.arrival_time{color:white}.player_settings.section:hover{background-color:#423f3b70}.game_body:hover{background-color:#423f3b70}.game_list:hover{background-color:#423f3b70}ul{color:white}#pact_info_box:hover{background-color:#423f3b70}.game_border:hover{background-color:#423f3b70}.grepo_menu .gm_middle_center{background:url(https://i.imgur.com/JQZLJNN.png) repeat 0 0}.rbtn_reservation_type.radiobutton{color:white}.search_by_label{color:white}.option.js-option.checked{color:white}.option.js-option{color:white}#ally_announce_bbcodes{background:url(https://i.imgur.com/JQZLJNN.png) repeat 0 0}#publish_report_dialog_form{color:white}#publish_report_dialog_form{background-color:#423f3b70}.preview_text{color:white}.color_picker_window .color_preview .text_preview_box{background:url(https://i.imgur.com/JQZLJNN.png) repeat 0 0}.example_text{color:white}.main_dialog_text_area:hover{background-color:#423f3b70}.report_losts{animation:fadeInOutIn 3s ease infinite;color:#f1fd00;font-weight:bold;font-size:1.0em}.report_losts:hover{animation-duration:0s}#trade_tab .content{background: #ffffff8a url(https://i.imgur.com/BCUgYDS.gif);}.questlog_index .island_quests .questgiver.question_mark{background:url(https://i.imgur.com/0awzuQk.png) no-repeat -700px -33px;width:46px;height:46px}  </style>').appendTo("head");
                }
                //Groot
                if (DATA.options.joe_tj) {
                    $('<style id="joe_Scrollbar">.classic_window .filler{background:url(https://i.imgur.com/QWQLg78.gif) 0 0;background-size:100%}div.gpwindow_content{background:url(https://i.imgur.com/QWQLg78.gif) 0 0;background-size:100%}.box.middle.center{background:url(https://i.imgur.com/QWQLg78.gif) 0 0;background-size:130%}.popup_middle_middle{background:url(https://i.imgur.com/QWQLg78.gif) 0 0;background-size:100%}.popup_table_inside{background:url(https://i.imgur.com/QWQLg78.gif) 0 0;background-size:100%}.bbcode_box.middle_center{background:url(https://i.imgur.com/QWQLg78.gif) 0 0;background-size:100%}.town_infos{background:url()}.gods_area .gods_container.god{background-image:url(https://i.imgur.com/xNakkYG.png)}#temple_god_static{background-image:url(https://i.imgur.com/HhG3qIW.png)}.god_mini{background-image:url(https://i.imgur.com/LNptz3f.png)}.ph_order_info{background-image:url(https://i.imgur.com/UeJePkL.png)}#unit_order_ph_background{position:absolute;width:446px;height:92px;left:0;bottom:0;background-image:url(https://i.imgur.com/59sARoR.png)}#buildings .building{position:relative;background:url(https://i.imgur.com/Mgnaxc0.png) no-repeat 0 0}#unit_order div.unit_order_tab{background:url(https://i.imgur.com/LFlptUN.png) 0 0 no-repeat}#ally_pact_list{background-Color:#FFFAFA00}#ally_flags .game_body{background:url(https://i.imgur.com/JQZLJNN.png)}#message_partner{background:url()}.barracks.window_background{background:url()}.game_body{background:url()}#unit_order_values td{background-color:#fffafa80}#unit_order_unit_info td{background-color:#fffafa80}.docks.window_background{background:url()}.city_overview_building.ship_1{background:url(https://i.imgur.com/TtrpoYQ.png)no-repeat;width:210px;height:140px}.window_storage_wrapper .storage_window_background{background:url()}.marketplace .marketplace_window_background{background:url()}.odd{background:url(https://i.imgur.com/JQZLJNN.png);border-bottom:2px solid #fff}.farm_window_background{background:url()}.game_list .even{background:url()}.game_list .even{background-color:#7675758f}.main_window_background{background:url()}.place_window_background{background:url()}.place_simulator_even,.place_simulator_even2{background:url(https://i.imgur.com/JQZLJNN.png)}.place_simulator_odd,.place_simulator_odd2{background:url(https://i.imgur.com/JQZLJNN.png)}.academy .academy_image{background:url()}.academy .tech_tree_box .column{background:url()}.academy .tech_tree_box .column.inactive{background:url(https://i.imgur.com/bWJBd1I.png)}.construction_queue_sprite{background:url(https://i.imgur.com/0dPgTlH.png)}.grepo-frame .frame-content{background:url(https://i.imgur.com/JQZLJNN.png)}.various_orders_queue .various_orders_middle{background:url(https://i.imgur.com/Vjh5FgH.png) repeat 0 0;opacity:.6}.stoner_window_background{background:url()}.ironer_window_background{background:url()}#mines_text{background:url(https://i.imgur.com/JQZLJNN.png)}#mines_values tr.even{background:url(https://i.imgur.com/JQZLJNN.png)}#mines_values tr.odd{background:url(https://i.imgur.com/JQZLJNN.png)}.game_list_footer{background:url(https://i.imgur.com/JQZLJNN.png)}.game_inner_box .game_footer{background:url(https://i.imgur.com/JQZLJNN.png)}.god_selection .background{background:url()}.advisor_hint{background:url(https://i.imgur.com/JQZLJNN.png)}.game_list .odd{background:url(https://i.imgur.com/JQZLJNN.png)}.wall_window_background{background:url()}.hide_window_wrapper .hide_window_background{background:url()}.brown{background:url(https://i.imgur.com/JQZLJNN.png)}.game_table_odd{background:url()}.game_table td{border-bottom:1px solid #fff9}.reservation_tool .gp_tab_page{background:url()}#message_message,#message_new_message{background-Color:#fffafaa3}.message_post_content{background:url()}.message_post{background:url(https://i.imgur.com/JQZLJNN.png)}#folder_toggle_menu{background:url(https://i.imgur.com/JQZLJNN.png)}.alliance_link,a{color:#fff}#overviews_link_hover_menu .subsection.disabled li a{color:#fff}.top_description{color:#fff}p{color:#fff}i{color:#fff}h5{color:#fff}li{color:#fff}h3{color:#fff}h4{color:#fff}.tcol1{color:#fff}.tcol2{color:#fff}.tcol3{color:#fff}.tcol4{color:#fff}.reservation.no_results{color:#fff}.reservation_tool .reservations_list .header div{border-bottom:2px solid #fff}b{color:#fff}b{color:#fff}label{color:#fff}strong{color:#fff}.content{color:#fff}#message_new_preview_body{color:#fff}#create_list_name_form{color:#fff}.level.number{color:#fff}.game_body{color:#fff}div.advisor_hint .pf_bonus{color:#fff}#mines_text{color:#fff}td{color:#fff}.preview_box{color:#fff}.message_post_content{color:#fff}div.bbcodes_spoiler_text{background-color:#fff;padding-top:3px;margin:3px 0 0 0}div.quote div.quote_message{background-color:#b2b2b280;font-size:8pt;margin-top:0;padding:2px 3px}#custom_map_color_background{background:url(https://i.imgur.com/RXg9l4S.png)}#town_group_active_towns,#town_group_all_towns{background:url()}#town_group_active_towns,#town_group_all_towns{background-color:#fff3}div.group_list_scroll_border{background:url()}.game_table{background:url()}.box.middle.center div.box_content{background:#ffffff87}.notes .window_content .notes_container textarea{background:#fffafaa3}#edit_profile_form textarea,#player_settings .list_item_right fieldset{background-Color:#FFFAFA7d}#awards_visibility_all,#awards_visibility_ally,#awards_visibility_player{background:url(https://i.imgur.com/IATpjbE.png)}#awards_visibility_all_wrapper,#awards_visibility_ally_wrapper,#awards_visibility_player_wrapper{background:url(https://i.imgur.com/IATpjbE.png)}.questlog_index .quest.selected{background:url(https://i.imgur.com/JQZLJNN.png)}.report_units_overview{background:url()}.report_booty_bonus_fight{background:url(https://i.imgur.com/JQZLJNN.png)}#ally_profile_info #ally_pacts,#ally_profile_info #ally_profile{background:url(https://i.imgur.com/JQZLJNN.png)}#ally_towns .members_list{background:url(https://i.imgur.com/JQZLJNN.png)}#ally_towns .members_list li.even,#ally_towns .members_list li.header,#ally_towns .members_list li.odd{border-bottom:1px solid #127213}#ally_towns .members_list li.header{background:url(https://i.imgur.com/JQZLJNN.png)}div.island_info_towns ul{background:url(https://i.imgur.com/JQZLJNN.png)}#island_towns_controls{background:url(https://i.imgur.com/JQZLJNN.png)}#trade_tab .content{background: #ffffff8a url(https://i.imgur.com/BCUgYDS.gif);}.ui_construction_queue .construction_queue_frame .queue_BG_slice-middle{background:url(https://i.imgur.com/ZsPEHJG.png)}#towninfo_description{background-color:#ccc6}.town_cast_spell_oldcontent { background: #ccc6 !important; }.city_overview_building.field_3{background:url(https://i.imgur.com/QANAOvr.png)}.attack_planner.attacks .attacks_list{background:url(https://i.imgur.com/JQZLJNN.png)}.attack_planner li.selected{background-color:#40c43399}.attack_planner.show_plan .attacks_list li.selected{background-color:#40c43399}.lumber_window_background{background:url()}.published_report .espionage_report,.published_report .power_report{background:#fff6;overflow:hidden;padding-bottom:5px}.published_report .report_units_overview{height:auto;width:100%;background:#0000009c;position:relative}.colA0A0FF{background:#9E9EF999}#message_reply_message{background:#FFFAFA7d}.report_units_overview{background-color:#8e8e91}.headline{color:#fff}.second_headline{color:#fff}.sandy-box .corner_bl,.sandy-box .corner_br,.sandy-box .corner_tl,.sandy-box .corner_tr{opacity:.8}.sandy-box .border_b,.sandy-box .border_t{opacity:.8}.sandy-box .border_l,.sandy-box .border_r{opacity:.8}.sandy-box .middle{opacity:.8}.marketplace.all_offers tr:nth-child(2n):not(.premium_exchange),.marketplace.own_offers tr:nth-child(2n):not(.premium_exchange){background:url() repeat 0 0;background-color:#0009}.marketplace.all_offers table,.marketplace.own_offers table{background:url() repeat 0 0;background-color:#fff9}div.bbcodes_spoiler_text{background-color:#beffb999}#building_overview tr td.locked{background-color:#beffb999}#newthread{padding:0;background:transparent url(https://i.imgur.com/JQZLJNN.png) repeat scroll 0 0;height:374px}#newthread #bbcodes{border-bottom:1px solid #ffffff80;border-top:1px solid #ffffff80;background:transparent url(https://i.imgur.com/JQZLJNN.png) repeat scroll 0 0;position:relative;height:24px;padding:5px}#forum_post_textarea.newthread{height:299px;width:100%;margin:4px 0;opacity:.7}#forum_post_textarea.newpoll{height:215px;width:100%;margin:4px 0;background:#fffafa80}#forum_admin .forum.odd .name .text_box{background:transparent url() repeat scroll 0 0}#forum_admin .forum.even .name .text_box{background:transparent url() repeat scroll 0 0}.forum_toggle #toggle{border-left:1px solid #d0be97;float:right;padding:4px;padding-bottom:4px;width:120px;margin-bottom:-50px;padding-bottom:50px;background:url() repeat scroll 0 0 transparent}#premium_overview_inner{background:url() repeat scroll 0 0 transparent;overflow-x:hidden;overflow-y:auto;height:361px}.settings-container #player_settings{position:relative;color:white}#post_save_wrapper{height:193px;background:#ffffff80 url() repeat scroll 0 0}.forum_toggle{border-bottom:1px solid #d0be97;background:transparent url(https://i.imgur.com/JQZLJNN.png) repeat scroll 0 0;overflow:hidden;height:24px;position:relative}#message_reply_preview{background:url(https://i.imgur.com/JQZLJNN.png)repeat scroll 0 0 transparent}li.found_post div.post_text{background-color:#dfeee000}.even{background:url() repeat 0 0;border-bottom:2px solid #fff;border-bottom-width:2px}div.quote div.quote_author{font-weight:700;font-size:8pt;margin-bottom:0;background-color:#f8d17d99}.fight_report_classic{opacity:.8}.reservation.even{background-color:#fff6}.reservation.odd{background-color:#fff3}.dropdown_list_square .content .option.selected,.dropdown_list_square .content .option:hover{background:url(https://i.imgur.com/JQZLJNN.png) repeat 0 0;background-color:#fff900b3}.ac_results{background:url(https://i.imgur.com/JQZLJNN.png)}.ac_odd.ac_over{background-color:#fff900cc}.ac_even.ac_over{background-color:#fff900cc}.ac_odd{background:url(https://i.imgur.com/JQZLJNN.png) repeat}.ac_even{background:url(https://i.imgur.com/JQZLJNN.png) repeat}.cell_casted_powers{background-color:#b6f6b366}#trade_selected{background:url()}#trade_selected{background-color:#586e5c99}#ranking_search_info{background:url() repeat scroll 0 0}#ranking_search_info{background-color:#fbff0099}.game_list li{padding:4px 2px;border-bottom:1px solid #fff9}#premium_overview_text_area{color:white}.message_date{color:#fffffeb3}legend{color:white}.published_report_header{border-bottom:1px solid #ca8;padding:4px;background-color:#6a624c}.postcount{color:white}center{color:white}.small{color:white}#forum_description{color:white}#thread_functions{display:none;overflow:visible;height:0;background:transparent url(https://i.imgur.com/JQZLJNN.png) repeat scroll 0 0;border-bottom:1px solid #d0be97;position:absolute;z-index:90;left:0;right:0}.control{background:#ccc6}.background_light{background:url(https://i.imgur.com/JQZLJNN.png) repeat 0 0}.description.description_viewport.background_default.border_orange.scrollbar_not_active{background:#ccc6}.info_text.runtime_time{color:white}.info_text.arrival_at{color:white}.info_text.research_espionage_bonus_text{color:white}.way_duration{color:white}.arrival_time{color:white}.max_booty.storage_icon{color:white}.slow_boats_needed{color:white}.fast_boats_needed{color:white}.fight_bonus.morale{color:white}.no_results{color:white}span.fp_loot_text{color:white}.islandinfo_coords{color:white}.islandinfo_free{color:white}#fto_town_list li.fto_island{background:url(https://i.imgur.com/JQZLJNN.png) repeat}#fto_town_list{min-height:405px;max-height:405px;overflow-y:auto;overflow-x:hidden;background:url() 0 0 repeat;background-color:#ccc6;cursor:pointer}#fto_town_list li.fto_town.active,div.fto_time_checkbox.active{background:#232423b3}.js-caption{color:white}.farm_town .action_wrapper .trading_wrapper .bpv_ratio_text{font-weight:600;color:#fff;position:absolute;top:62px;left:298px}.tooltip_reward_day .reward_wrapper{background:url() repeat scroll 0 0 transparent;margin:15px 5px auto;border:1px solid #c3a56199}.farm_town .action_wrapper .trading_wrapper{background:url(https://i.imgur.com/fv1gsvn.png) no-repeat 0 -396px;width:635px;height:184px;position:absolute;top:32px;left:43px;text-align:center}.question{color:white}.additional_question{color:white}.cbx_caption{color:white}.captain_commercial .message{min-height:64px;background-color:#ffe4b199;margin:0 70px 0 0;overflow:hidden;position:relative}.option.js-option{color:black}.scroll{background:#0000001a}.italic{color:white}.bold{color:white}#place_culture_bg{position:relative;background-image:url(https://i.imgur.com/hH9NzQ8.png);width:690px;height:52px;bottom:0;left:21px;margin-bottom:10px;padding:3px}#culture_overview_towns div.celebration_button,#culture_overview_towns div.celebration_icon,#culture_overview_towns div.celebration_icon_bg,#culture_overview_towns div.celebration_name,#culture_overview_towns div.celebration_progressbar,#culture_overview_towns div.celebration_progressbar div,#hides_overview_towns div.help_button,#hides_overview_towns div.hide_icon,#hides_overview_towns div.hide_icon_bg,#hides_overview_towns div.hide_progressbar,#hides_overview_towns div.hide_progressbar div,#hides_overview_towns div.iron_name{background-image:url(https://i.imgur.com/7OeZOK3.png);position:absolute}#town_group_overview_head{color:white}#farm_report_form .game_table th,#resource_transport_report_form .game_table th{color:#fff}.description{color:white}.effect.background_light{color:white}.requirement.background_light{color:white}.title{color:white}span{color:white}.clearfix{color:white}.message_poster.small.message_partner{background-color:#dbffda5c}.message_poster.small{background-color:#a09c9c5e}.item.town_group_town,.sandy-box .item,.sandy-box .item_no_results{color:#fff}#units .max{color:#fff}.game_inner_box .game_body2{background:url() repeat;padding:3px 6px 3px 6px}.tooltip_with_arrow .twa_background_fake{background:url(https://i.imgur.com/JQZLJNN.png) repeat 0 0}#folder_menu_messages{background:transparent url() repeat scroll 0 0}.table_box .table_box_content .body{background:url()}.option.js-option{color:white}.storage_resbar{background:url(https://i.imgur.com/SijS8ct.png) no-repeat}#recipient_list_form_1{color:white}#popup_div_curtain{color:white}#folder_menu_reports{background:url()}#recipient_list_form_1{color:white}.inner_recipient_list{border-bottom:1px solid #fff}.main_ranking.brown_header_light tbody tr:nth-child(2n1){background:url() repeat 0 0}.main_ranking.brown_header_light tbody tr:nth-child(2n){background:url() repeat 0 0}.main_ranking.brown_header_light tbody tr:nth-child(2n){background:#0000005e}.main_ranking.brown_header_light tbody tr:nth-child(2n).highlight,.main_ranking.brown_header_light tbody tr:nth-child(2n1).highlight{background-color:#55fc4569;0 0}.noquest_description{color:white}.timer{color:white}.special_buildings_image{opacity:.5}.section.even.market_offer{opacity:.8}#premium_exchange{opacity:.8}#casted_power_reports{color:white}.nightbonus{color:white}.task_description{color:white}#trade_tab{color:white}.grepo_box .grepo_box_background,.grepo_box>.background{background:url()}.grepo_curtain .middle{background:url()}.grepo_curtain .left,.grepo_curtain .middle,.grepo_curtain .right{background:url()}.building_overview #building_overview td.building.hover,.building_overview #building_overview tr:hover{background:#9ba0ff73}#townsoverview .game_list li:hover{background-image:url()}#townsoverview .game_list li:hover{background-color:#9ba0ff73}.hepler_row{background:#262c4073}.info_dialog.info_create_first_town_group{color:white}#recruit_overview .unit_queue.unknown_transparent{border:1px solid #ffffffa3;color:#ffffffa3}div.trade_town{background:url(https://i.imgur.com/JZPEp90.png) 0 0 no-repeat}.trade_town_wrapper{background:url(https://i.imgur.com/JZPEp90.png) right -125px no-repeat}.alliance_link,a{color:#fff;transition-duration:.5s;transition-timing-function:ease-in;transition-property:all}.game_table_even.bottom{background:url(https://i.imgur.com/JQZLJNN.png)}.game_table_odd{background-color:#7675758f}.color_highlight,.item_selected{background-color:#9ba0ff73}.gp_link_fake{color:##fffc}.description{background:#262c403b}.domination_peace_wrapper{color:white}.domination_peace_wrapper{background:#262c403b}.inventory .inventory_bg{background-image:url(https://i.imgur.com/0G3IzlZ.png)}.notes .window_content .notes_container .preview_box{background:url();background-Color:#ffffff63}.god_info_box{background:#262c403b}.attack_spots .attacking_units .cb_bg,.attack_spots .defending_units .cb_bg{background:url();background-color:#f6d59080}.attack_spots .attacking_units .curtain_box .cb_bg{background:url();background-color:#f6d59080}textarea{background:#ffffff82}.grepo-frame .frame-content{background:url();background-color:#0003}.farm_towns.lvl_0 .actions .action_wrapper .bpv_trade_illustration{background:url();background-color:#0000006e}.farm_towns.lvl_0 .actions .action_wrapper{background:url();background-color:#0000008a}#ally_finder_text tr:first-child{background-color:#849eeda3}.checkbox_description{color:white}.descr{color:white}#outer_troops_box .outer_troops_sort_box{background:url();background-Color:#00000075}.attack_spots .reward_title{color:#fff}.bpv_trade_description{color:white}.bpv_trade_title{color:white}.classic_window.heroes_train .heroes_train .middle_border{background:url();background-color:#00000091}.classic_window.heroes_train .heroes_train .inner_border{background:url();background-color:#0000008a}.academy .research_points_box{background-image:url(https://i.imgur.com/Y4iUo71.png)}</style>').appendTo("head");
                }
            }
        },
        deactivate: function() {
            $('#joe_Scrollbar').remove();
            $('#joe_Scrollbar_display').remove();
            $('#joe_Scrollbar_display').remove();
            $('<style id="joe_Scrollbar_none">' +
                '#scrollbar { display:none!important; } ' +
                '</style>').appendTo('head');
        }
    };
    ///////////////////////////////////
   //     * Units beyond view *     //
  ///////////////////////////////////
    var UnitsBeyondView = {
        activate: function() {
            {
                setTimeout(function() {
                    UnitsBeyondView.activate();
                }, 0);
            }
            var selected_town = ITowns.getTown(Game.townId);
            var GD_units = GameData.units;
            var GD_heroes = GameData.heroes;
            var Transporter_Offset = selected_town.researches().hasBerth() ? GameDataResearches.getBonusBerth() : 0;
            var tr_small_cap = GameData.units.small_transporter.capacity + Transporter_Offset;
            var tr_big_cap = GameData.units.big_transporter.capacity + Transporter_Offset;

            function calculate(tr_type_cap, Transport_Capacity, Ground_Units_BHP) {
                var diff = Transport_Capacity - Ground_Units_BHP;
                var tr_empty = Math.floor(diff / tr_type_cap);
                var rest = tr_type_cap - (diff - (tr_empty * tr_type_cap));
                if (rest != tr_type_cap) {
                    tr_empty++;
                } else {
                    rest = 0;
                }
                return [tr_empty, rest];
            }
            $("#units_beyond_list > LI, .support_row").each(function(i, e) {
                var Ground_Units_BHP = 0;
                var Transport_Capacity = 0;
                var a = $(this).children(".unit_icon40x40");
                a.each(function(index) {
                    var className = this.className.split(' ');
                    var unit = className[className.length - 2];
                    var number = $(this).text().trim();
                    if (!(unit in GD_heroes) && !GD_units[unit].flying && GD_units[unit].capacity == undefined) {
                        Ground_Units_BHP += number * GD_units[unit].population;
                    } else if (!(unit in GD_heroes) && !GD_units[unit].flying && GD_units[unit].capacity != 0) {
                        Transport_Capacity += number * (GD_units[unit].capacity + Transporter_Offset);
                    }
                });
                $(this).find(".place_sendback_container").css({
                    "margin-top": "4px"
                });
                if (Transport_Capacity > 0) {
                    var tr_small = calculate(tr_small_cap, Transport_Capacity, Ground_Units_BHP);
                    var tr_big = calculate(tr_big_cap, Transport_Capacity, Ground_Units_BHP);
                    var tooltip =
                        '<div style="position: absolute; margin-left: 40px; margin-top: 5px">' +
                        '<div class="flask_sendback_big">' +
                        '<div class="flask_sendback_img" style="background-position: -405px -150px; "><span class="flask_sendback_img_span big_naval">' + tr_big[0] + '</span></div>' +
                        '<div class="flask_sendback_img_helmet" style="background-position: -290px -365px; margin-left: 25px"><span class="flask_sendback_img_span big_land">' + tr_big[1] + '</span></div>' +
                        '</div>' +
                        '<div class="flask_sendback_small">' +
                        '<div class="flask_sendback_img" style="background-position: -405px -175px;"><span class="flask_sendback_img_span small_naval">' + tr_small[0] + '</span></div>' +
                        '<div class="flask_sendback_img_helmet" style="background-position: -290px -365px; margin-left: 25px"><span class="flask_sendback_img_span small_land">' + tr_small[1] + '</span></div>' +
                        '</div></div>';
                    if ($(this).find(".flask_sendback_header_span").length == 0) {
                        $(this).children("h4").append('<span class="flask_sendback_header_span"> (' + Ground_Units_BHP + '/' + Transport_Capacity + ')</span>')
                        $(this).find(".place_sendback_container").append(tooltip);
                    } else {
                        $(this).find(".flask_sendback_header_span").text(' (' + Ground_Units_BHP + '/' + Transport_Capacity + ')');
                        $(this).find(".flask_sendback_big .big_naval").text(tr_big[0]);
                        $(this).find(".flask_sendback_big .big_land").text(tr_big[1]);
                        $(this).find(".flask_sendback_small .small_naval").text(tr_small[0]);
                        $(this).find(".flask_sendback_small .small_land").text(tr_small[1]);
                    }
                }
            });
            $(".flask_sendback_img").css({
                "width": "19px",
                "height": "19px",
                "background-image": "url(https://gpit.innogamescdn.com/images/game/layout/alpha_sprite_2.69.png)",
                "background-repeat": "no-repeat",
                "display": "block",
                "float": "left"
            });
            $(".flask_sendback_img_helmet").css({
                "width": "18px",
                "height": "16px",
                "background-image": "url(https://gpit.innogamescdn.com/images/game/layout/alpha_sprite_2.69.png)",
                "background-repeat": "no-repeat",
                "display": "block",
                "float": "left"
            });
            $(".flask_sendback_header_span").css({
                "padding-left": "28px"
            });
            $(".flask_sendback_img_span").css({
                "margin-left": "25px"
            });
            $(".flask_sendback_small").css({
                "float": "left",
                "margin-top": "1px"
            });
        },
        deactivate: function() {
            $('#flask_sendback_big').remove();
            $('#flask_sendback_small').remove();
        },
    };
    ///////////////////////////////////
   //       * Cave Overview *       //
  ///////////////////////////////////
    $('<style id="joe_hhidesOverview_style"> ' +
        '#hides_sort_control {display:none!important;} ' +
        '#hides_overview_wrapper { top: 0px;} ' +
        '</style>').appendTo("head");
    var hidesIndexIron = {
        activate: function() {},
        add: function() {
            try {
                var silver_total = 0;
                var city_boxes = $("#hides_overview_towns").find(".town_item");

                function silverToInt(str) {
                    return parseInt(str.split("/")[0].replace(/\D/g, "")) || 0;
                }
                if (silver_total === 0) {
                    for (var a = 0; a < city_boxes.length; a++) {
                        silver_total += silverToInt($(city_boxes[a]).find(".hide_progressbar").text());
                    }
                }
                for (var d = 0; d < city_boxes.length; d++) {
                    var e = $(city_boxes[d]);
                    silver_total += silverToInt(e.find(".hide_progressbar").text());
                    var f = e.find(".iron");
                    var g = Number(f.text().trim());
                    var h = e.find("input");
                    if (null != h.val() && g > 15e3) {
                        h.val(g - 15e3).change();
                        e.find(".iron_img").click();
                        var i = HidesOverview.spinners[e.find(".iron_img").attr("name")];
                        i.setValue(g - 15e3)
                    }
                }
                if ($('#hide_espionage').length == 0)
                    return;
                var b = ITowns.getTown(parseInt(Game.townId)).getCurrentResources().iron;
                if (b > 15e3) {
                    $("#hide_espionage :input").val(b - 15e3);
                    setTimeout(function() {
                        $("#hide_espionage :input").select().blur();
                    }, 10);

                } else {
                    $("#hide_espionage :input").val("");
                    setTimeout(function() {
                        $("#hide_espionage :input").select().blur();
                    }, 10);
                }
                $("#joe_sortinit").click(function() {
                    sort($("#joe_sort_towns").val());
                    $(this).toggleClass('active')
                });
            } catch (error) {
                errorHandling(error, "hidesIndexIron");
            }
        },
        deactivate: function() {
            $('#joe__style').remove();
        },
    };
    var hidesOverview = {
        activate: function() {
            $('<style id="joe_hidesOverview_style"> ' +
                '#joe_hides_sort_control { bottom: -8px; left: -9px; padding: 0 2px; right: -9px; top: -9px; z-index: 3000;} ' +
                '#joe_button_table_resize { background-image: url("https://i.imgur.com/cNyFYNz.png"); background-repeat: no-repeat; display: block !important; float: left; width: 22px; height: 23px; margin-right: 5px; margin-top: 2px; cursor: pointer;} ' +
                '#joe_button_table_resize:hover { background-position: 0px -23px !important;} ' +
                '#joe_button_table_resize.active { background-position: 0px -46px !important;} ' +
                '#joe_sortinit { margin: 3px 0 0 3px;} ' +
                '#joe_hides_sort_control .border { border-bottom: 1px solid #222; left: -2px; position: absolute; right: -2px; top: 28px;} ' +
                '#hides_overview_wrapper { height: 425px!important; top: 39px;} ' +
                '#hides_overview_towns { border-top: 0px;} ' +
                '#joe_hides_silver_total { background: #ffe2a1 none repeat scroll 0 0; border: 1px solid #e1af55; font-size: 10px; padding: 0 4px 2px 1px; position: absolute; right: 2px; top: 3px;} ' +
                '#joe_hides_silver_total .resource_iron_icon { padding-left: 25px; width: auto;} ' +
                '#joe_hides_silver_total .silver_amount { display: block; padding-top: 1px;} ' +
                '.joe_res_plenty, .joe_res_rare { background: url(https://gpde.innogamescdn.com/images/game/layout/resources_deposit.png) no-repeat scroll 0 0; height: 10px; width: 10px; position: absolute; left: 29px;} ' +
                '.joe_res_rare { background-position: 0 -10px;} ' +
                '#hides_overview_towns.joe_resize .box_content { display: none;} ' +
                '#hides_overview_towns.joe_resize .hide_buttons, #hides_overview_towns.joe_resize .spinner { top: 23px;} ' +
                '</style>').appendTo("head");
        },
        init: function() {
            try {
                var silver_total = 0;
                var selection, order;
                var city_boxes = $("#hides_overview_towns").find(".town_item");

                function silverToInt(str) {
                    return parseInt(str.split("/")[0].replace(/\D/g, "")) || 0;
                }
                if (silver_total === 0) {
                    for (var a = 0; a < city_boxes.length; a++) {
                        silver_total += silverToInt($(city_boxes[a]).find(".hide_progressbar").text());
                    }
                }
                var sort_options = [
                    ["ironinstore", getText("caves", "stored_silver")],
                    ["name", DM.getl10n("mass_recruit").sort_by.name],
                    ["wood", DM.getl10n("mass_recruit").sort_by.wood],
                    ["stone", DM.getl10n("mass_recruit").sort_by.stone],
                    ["iron", DM.getl10n("mass_recruit").sort_by.iron]
                ];

                joe.wnd.append('<div id="joe_hides_sort_control" class="overview_search_bar"><div id="joe_button_table_resize"></div>' + hidesOverview.grepo_dropdown("joe_sort_towns", sort_options) + hidesOverview.grepo_input("margin-top:0px", "joe_sortfilterbox", "")[0].outerHTML + '<div id="joe_sortinit" class="button_order_by active"></div><div id="joe_hides_silver_total"><span class="resource_iron_icon iron"><span class="silver_amount">' + silver_total + '</span></span></div><div class="border"></div></div>');

                function table_resize_handler1() {
                    $(this).addClass("active");
                    $("#hides_overview_towns").addClass("joe_resize");
                    city_boxes.each(function(index) {
                        var iron_span_class = $(this).find(".box_content.res_box .iron SPAN:first-child").prop("class");
                        if (iron_span_class == "res_rare") {
                            $(this).find(".iron_img").append('<span class="joe_res_rare"></span>');
                        } else if (iron_span_class == "res_plenty") {
                            $(this).find(".iron_img").append('<span class="joe_res_plenty"></span>');
                        }
                    });
                    $(this).one("click", table_resize_handler2);
                }

                function table_resize_handler2() {
                    $(this).removeClass("active");
                    $("#hides_overview_towns").removeClass("joe_resize");
                    city_boxes.find(".joe_res_plenty, .joe_res_rare").remove();
                    $(this).one("click", table_resize_handler1);
                }
                $('#joe_button_table_resize').one("click", table_resize_handler1);

                function isNumber(n) {
                    return !isNaN(parseFloat(n)) && isFinite(n);
                }
                function setfilter(selection) {
                    $('#hides_overview_towns>li').show();
                    if (isNumber($('#joe_sortfilterbox').val())) {
                        regexpRES = RegExp(/wood|stone|iron/);
                        regexpInS = RegExp(/eta/);
                        regexpNoT = RegExp(/gp_town_link/);
                        numericfilter = parseInt($('#joe_sortfilterbox').val());
                        $('#hides_overview_towns>li').each(function(i, e) {
                            if (regexpRES.test(selection)) {
                                selectedSort = parseInt($(e).find(selection).text()) || 0;
                            } else if (regexpInS.test(selection)) {
                                selectedSort = parseInt($(e).find(selection).text().substr(1)) || 0;
                            } else {
                                selectedSort = $(e).find(selection).text();
                                if (!(selectedSort.indexOf(numericfilter) >= 0)) {
                                    $(e).hide();
                                }
                            }
                            if (numericfilter > selectedSort) {
                                $(e).hide();
                            }
                        });
                    } else {
                        namefilter = $('#joe_sortfilterbox').val();
                        $('#hides_overview_towns>li').each(function(i, e) {
                            townname = $(e).find('a.gp_town_link').text();
                            if (namefilter.length > 0 && !(townname.indexOf(namefilter) >= 0)) {
                                $(e).hide();
                            }
                        });
                    }
                };
                function sort(selection) {
                    order = !order;
                    switch (selection) {
                        case "ironinstore":
                            selection = 'span.eta';
                            break;
                        case "name":
                            selection = 'a.gp_town_link';
                            break;
                        case "wood":
                            selection = 'span.wood span.count';
                            break;
                        case "stone":
                            selection = 'span.stone span.count';
                            break;
                        case "iron":
                            selection = 'span.iron span.count';
                            break;
                    }
                    setfilter(selection);
                    var joe_ArrayUnsorted = $('#hides_overview_towns>li').get();
                    joe_ArrayUnsorted.sort(function(a, b) {
                        regexpRES = RegExp(/wood|stone|iron/);
                        regexpInS = RegExp(/eta/);
                        if (regexpRES.test(selection)) {
                            a = parseInt($(a).find(selection).text()) || 0;
                            b = parseInt($(b).find(selection).text()) || 0;
                        } else if (regexpInS.test(selection)) {
                            a = parseInt($(a).find(selection).text().substr(1)) || 0;
                            b = parseInt($(b).find(selection).text().substr(1)) || 0;
                        } else {
                            a = $(a).find(selection).text().toLowerCase();
                            b = $(b).find(selection).text().toLowerCase();
                            if (order) {
                                return a.localeCompare(b);
                            } else {
                                return b.localeCompare(a);
                            }
                        }
                        if (order) {
                            return b - a
                        } else {
                            return a - b
                        }
                    });
                    for (var i = 0; i < joe_ArrayUnsorted.length; i++) {
                        joe_ArrayUnsorted[i].parentNode.appendChild(joe_ArrayUnsorted[i]);
                    }
                }
                $("#joe_sortinit").click(function() {
                    sort($("#joe_sort_towns").val());
                    $(this).toggleClass('active')
                });
            } catch (error) {
                errorHandling(error, "hidesOverview");
            }
        },
        refresh_silver_total: function(xhr) {
            var JQ_silver_total = $('#joe_hides_silver_total .silver_amount');
            var silver_total = parseInt(JQ_silver_total.text());
            var silver_stored = $.parseJSON(xhr.responseText).json.iron_stored;
            silver_total += silver_stored;
            JQ_silver_total.text(silver_total);
        },
        grepo_dropdown: function(ID, Options) {
            var str = '<span class="grepo_input"><span class="left"><span class="right"><select name="' + ID + '" id="' + ID + '" type="text">';
            $.each(Options, function(a, b) {
                if (b[1]) {
                    str += '<option value="' + b[0] + '">' + b[1] + '</option>'
                } else {
                    str += '<option value="' + b + '">' + b + '</option>'
                }
            });
            str += '</select></span></span></span>';
            return str;
        },
        grepo_input: function(Style, ID, Text) {
            return $('<div class="input_box" style="' + Style + '"><span class="grepo_input"><span class="left"><span class="right"><input id="' + ID + '" type="text" value="' + Text + '"></span></span></span></div>');
        },
        deactivate: function() {
            $('#joe_hidesOverview_style').remove();
            $('#joe_hides_sort_control').remove();
        },
    };
    ///////////////////////////////////
   //      * culture Overview *     //
  ///////////////////////////////////
    var cultureOverview = {
        activate: function(e) {
            try {
                var a = $("ul#cultur_overview_towns");
                var b,
                    c,
                    d,
                    e;
                e = 0;
                b = $('a[class~="confirm"][class~="type_triumph"]');
                d = $('a[class~="confirm"][class~="type_triumph"][class~="disabled"]');
                if (d.length > 0) {
                    for (var f = 0; f < b.length; f++) {
                        if ($(b[f]).attr("class").indexOf("disabled") > 1)
                            continue;
                        c = $(b[f]).parents('li[id^="ov_town_"]');
                        eltext = c[0].previousSibling;
                        $(c).insertBefore($(d[0]).parents('li[id^="ov_town_"]'));
                        $(eltext).insertBefore($(d[0]).parents('li[id^="ov_town_"]'))
                    }
                }
                e = 0;
                b = $('a[class~="confirm"][class~="type_theater"]');
                d = $('a[class~="confirm"][class~="type_theater"][class~="disabled"]');
                if (d.length > 0) {
                    for (var f = 0; f < b.length; f++) {
                        if ($(b[f]).attr("class").indexOf("disabled") > 1)
                            continue;
                        c = $(b[f]).parents('li[id^="ov_town_"]');
                        eltext = c[0].previousSibling;
                        $(c).insertBefore($(d[0]).parents('li[id^="ov_town_"]'));
                        $(eltext).insertBefore($(d[0]).parents('li[id^="ov_town_"]'))
                    }
                }
                e = 0;
                b = $('a[class~="confirm"][class~="type_party"]');
                d = $('a[class~="confirm"][class~="type_party"][class~="disabled"]');
                if (d.length > 0) {
                    for (var f = 0; f < b.length; f++) {
                        if ($(b[f]).attr("class").indexOf("disabled") > 1)
                            continue;
                        c = $(b[f]).parents('li[id^="ov_town_"]');
                        eltext = c[0].previousSibling;
                        $(c).insertBefore($(d[0]).parents('li[id^="ov_town_"]'));
                        $(eltext).insertBefore($(d[0]).parents('li[id^="ov_town_"]'))
                    }
                }
                var g = $("ul#culture_overview_towns span.eta");
                var h = $("#culture_points_overview_bottom #place_culture_count").text();
                if (h.indexOf("[") < 1) {
                    var i = h.split("/");
                    var j = parseInt(i[0]) + g.length;
                    var k = parseInt(i[1]) - j;
                    if (k > 0) {
                        $("#culture_points_overview_bottom #place_culture_count").append("<span id='joe_culture' style='color:#FFEF05'>[-" + k + "]</span>");
                    } else {
                        var l = new Array;
                        for (var f = 0; f < g.length; f++)
                            l.push($(g[f]).text());
                        l.sort();
                        var m = l[l.length + k - 1];
                        $("#culture_points_overview_bottom #place_culture_count").append(" [<span id='joe_culture'></span>]<span id='joe_cultureplus' style='color: #ECB44D'> +" + k * -1 + "</span>").find("span#joe_culture").countdown(m);
                    }
                } else {
                    var i = h.split("/");
                    var j = parseInt(i[0]) + g.length;
                    var k = parseInt(i[1]) - j;
                    if (k > 0) {
                        $("#joe_culture").text("[-" + k + "]");
                    } else {
                        CultureOverview.activate.wnd.reloadContent();
                    }
                }
                if ($('#joe_cultureBTN_wrapper').length == 0) {
                    $("#culture_overview_wrapper").parent().append('<div id="joe_cultureBTN_wrapper"><div class="joe_cultureBTN_wrapper_right"><div id="joe_cultureBTN_theather_r" class="joe_cultureBTN_r joe_cultureBTN_theather"></div><div id="joe_cultureBTN_triumph_r" class="joe_cultureBTN_r joe_cultureBTN_triumph"></div><div id="joe_cultureBTN_olympicgames_r" class="joe_cultureBTN_r joe_cultureBTN_olympicgames"></div><div id="joe_cultureBTN_cityfestival_r" class="joe_cultureBTN_r joe_cultureBTN_cityfestival"></div></div></div>');

                    $("#culture_overview_wrapper").css({
                        "top": "35px",
                        "height": "370px"
                    });
                    $("#joe_cultureBTN_wrapper").css({

                        "color": "white",
                        "font-family": "Verdana",
                        "font-weight": "bold",
                        "font-size": "12px",
                        "text-align": "center",
                        "line-height": "25px",
                        "text-shadow": "1px 1px 0 #000000"
                    });
                    $(".joe_cultureBTN_wrapper_left").css({
                        "position": "absolute",
                        "top": "0px",
                        "left": "0px",
                        "margin-left": "7px"
                    });
                    $(".joe_cultureBTN_wrapper_right").css({
                        "position": "absolute",
                        "top": "0px",
                        "right": "0px"
                    });
                    $(".joe_cultureBTN_l, .joe_cultureBTN_r").css({
                        "cursor": "pointer",
                        "max-width": "40px",
                        "min-width": "25px",
                        "height": "27px",
                        "float": "right",
                        "position": "relative",
                        "margin-left": "3px",
                        "border": "2px groove gray",
                        "background": "url(https://gpfr.innogamescdn.com/images/game/overviews/celebration_bg_new.png)"
                    });
                    $(".joe_cultureBTN_cityfestival").css({
                        "background-position": "0 -109px"
                    });
                    $(".joe_cultureBTN_olympicgames").css({
                        "background-position": "0 -140px"
                    });
                    $(".joe_cultureBTN_triumph").css({
                        "background-position": "0 -110px"
                    });
                    $(".joe_cultureBTN_theather").css({
                        "background-position": "0 -170px"
                    });
                    var joe_cultureBTN_r_clicked_last = "";

                    function hideTownElements(JQelement) {
                        var joe_cultureBTN_mode = "";
                        switch (JQelement.id) {
                            case "joe_cultureBTN_cityfestival_r":
                                joe_cultureBTN_mode = "ul li:eq(0)";
                                break;
                            case "joe_cultureBTN_olympicgames_r":
                                joe_cultureBTN_mode = "ul li:eq(1)";
                                break;
                            case "joe_cultureBTN_triumph_r":
                                joe_cultureBTN_mode = "ul li:eq(2)";
                                break;
                            case "joe_cultureBTN_theather_r":
                                joe_cultureBTN_mode = "ul li:eq(3)";
                                break;
                            default:
                                setTimeout(function() {
                                    HumanMessage.error("Error");
                                }, 0);
                                break;
                        }
                        if (joe_cultureBTN_r_clicked_last === JQelement.id) {
                            $("ul#culture_overview_towns li").filter(function() {
                                return !!$(joe_cultureBTN_mode, this).find('.eta').length;
                            }).toggle();
                            $(JQelement).toggleClass("culture_red");
                        } else {
                            $("ul#culture_overview_towns li").show().filter(function() {
                                return !!$(joe_cultureBTN_mode, this).find('.eta').length;
                            }).hide();
                            $(".joe_cultureBTN_r").removeClass("culture_red");
                            $(JQelement).addClass("culture_red");
                        }
                        joe_cultureBTN_r_clicked_last = JQelement.id;
                        $(".joe_cultureBTN_r").css({
                            border: "2px groove #808080"
                        });
                        $(".culture_red").css({
                            border: "2px groove #CC0000"
                        });
                    }
                    $(".joe_cultureBTN_r").click(function() {
                        hideTownElements(this);
                    });
                }
                var joe_cultureCounter = {
                    cityfestivals: 0,
                    olympicgames: 0,
                    triumph: 0,
                    theather: 0
                };
                var joe_bashpoints = $("#culture_points_overview_bottom .points_count").text().split("/");
                var joe_goldforgames = Math.floor($("#ui_box .gold_amount").text() / 50);
                joe_cultureCounter.triumph = Math.floor((parseInt(joe_bashpoints[0]) - parseInt(joe_bashpoints[1])) / 300) + 1;
                if (joe_cultureCounter.triumph < 0) {
                    joe_cultureCounter.triumph = 0;
                }
                joe_cultureCounter.cityfestivals = $('a[class~="confirm"][class~="type_party"]:not(.disabled)').length;
                joe_cultureCounter.olympicgames = $('a[class~="confirm"][class~="type_games"]:not(.disabled)').length;
                if (joe_goldforgames < joe_cultureCounter.olympicgames) {
                    joe_cultureCounter.olympicgames = joe_goldforgames;
                }
                joe_cultureCounter.theather = $('a[class~="confirm"][class~="type_theater"]:not(.disabled)').length;

                $("#joe_cultureBTN_cityfestival_r").text(joe_cultureCounter.cityfestivals);
                $("#joe_cultureBTN_olympicgames_r").text(joe_cultureCounter.olympicgames);
                $("#joe_cultureBTN_triumph_r").text(joe_cultureCounter.triumph);
                $("#joe_cultureBTN_theather_r").text(joe_cultureCounter.theather);
                $(".joe_cultureBTN_cityfestival").tooltip(joe_icon + getText("Quack", "cityfestivals"));
                $(".joe_cultureBTN_olympicgames").tooltip(joe_icon + getText("Quack", "olympicgames"));
                $(".joe_cultureBTN_triumph").tooltip(joe_icon + getText("Quack", "triumph"));
                $(".joe_cultureBTN_theather").tooltip(joe_icon + getText("Quack", "theater"));
            } catch (error) {
                errorHandling(error, "cultureOverview");
            }
        },
        deactivate: function() {
            $(".joe_cultureBTN_cityfestival").remove();
            $(".joe_cultureBTN_olympicgames").remove();
            $(".joe_cultureBTN_triumph").remove();
            $(".joe_cultureBTN_theather").remove();
            $("#joe_cultureBTN_wrapper").remove();
        },
    };
    ///////////////////////////////////
   //  * farming/village/shelper *  //
  ///////////////////////////////////
    var farmingvillageshelper = {
        activate: function() {},
        rememberloot: function() {
            var activeFarmClass = $('#time_options_wrapper .active').attr('class').split(' ');
            activeFarm = activeFarmClass[1];
        },
        setloot: function() {
            setTimeout(function() {
                $('#time_options_wrapper .' + activeFarm).click();
            }, 500);
        },
        islandHeader: function() {
            $('#fto_town_list li').each(function(index) {
                if (this.classList.length == 2) {
                    $(this).addClass("joe_li_island");
                    $(this).append(
                        '<div class="joe_colordivider" style="background: linear-gradient(to right,rgba(74, 195, 6, 0.85),rgba(116, 241, 98, 0.29)); display: block; height: 24px; margin: -4px -2px;"></div>' +
                        '<div class="checkbox_new checked" style="position: absolute; right: 2px; top: 5px"><div class="cbx_icon"></div></div>'
                    );
                    $(this).find("span").css({
                        "margin-left": "2px"
                    });
                    $(this).find("a").css({
                        "color": "rgb(238, 221, 187)"
                    });
                }
            });
            $('.joe_colordivider').click(function() {
                var el = $(this).parent().nextUntil(".joe_li_island");
                if ($('#fto_town_list li:first[style*="border-right"]').length == 0) {
                    el.slideToggle();
                } else {
                    el.toggleClass("hidden");
                }
            });
            $('<style type="text/css">#fto_town_list li.active {background: rgba(208, 190, 151, 0.60)} .joe_autoHideCitiesOff {background-position: 0px -11px}</style>').appendTo('head');
        },
        indicateLoot: function() {
            var activeIsland = $('#fto_town_list li.active').prevAll(".joe_li_island").first();
            activeIsland.find("div.checkbox_new").removeClass("disabled");
            activeIsland.find("div.joe_colordivider").trigger("click");
        },
        switchTown: function(direction) {
            var el;
            if (direction === "up") {
                el = $('#fto_town_list li.active').prevAll("li:not(.joe_li_island):visible").first();
            } else {
                el = $('#fto_town_list li.active').nextAll("li:not(.joe_li_island):visible").first();
            }
            el.click();
            if (el.get(0)) {
                el.get(0).scrollIntoView();
                var scrollPosition = el.get(0).parentNode.scrollTop;
                var scrollMax = scrollPosition += 405;
                var scrollContainer = el.get(0).parentNode.scrollHeight;
                if (scrollMax != scrollContainer) {
                    el.get(0).parentNode.scrollTop -= 160;
                }
            }
        },
        deactivate: function() {
            $("#joe_toggleAutohide").addClass('joe_autoHideCitiesOff');
        },
    };
    ///////////////////////////////////
   //      * Message Exporter *     //
  ///////////////////////////////////
    $('<script src="https://cdn.jsdelivr.net/npm/clipboard@2/dist/clipboard.min.js"></script>').appendTo("head");
    var MessageExport = {
        activate: function() {
            try {
                this.addCopyListener()
                createWindowType("JOE_BBCODEE", getText("messages", "bbmessages"), 700, 350, true, ["center", "center", 100, 100]);
                var wnd = GPWindowMgr.getOpenFirst(GPWindowMgr.TYPE_MESSAGE);
                var wndid = wnd.getID();
                if ($("#joe_messageExport").is(":visible"))
                    return;
                $('#qt_messageExport').remove();
                $("DIV#gpwnd_" + wndid + " DIV#message_message_list .game_header:first").append('<div id="joe_messageExport" style="float:right; margin-right:-5px; margin-top:-21px; cursor:pointer;">' + joe.createButton(getText("messages", "bbmessages")) + '</div><div id="joe_messageExportTMP" style="display:none"></div>');
                $("#joe_messageExport").tooltip(getText("messages", "export"));
                $("#joe_messageExport").click(function() {
                    var bb_content = "[quote]";
                    var t, p, a, i = "";
                    (t = $("#message_message_list .game_header").clone()).find("*").remove()
                    t = t.html().trim()
                    p = $("#message_partner a.gp_player_link").text().trim()
                    a = $("#message_partner span a").text().trim()
                    if (a) {
                        i = "([player]" + p + "[/player] [ally]" + a + "[/ally])"
                    } else if (p) {
                        i = "([player]" + p + "[/player])"
                    };
                    bb_content += "[b]" + DM.getl10n("layout").main_menu.items.messages + ":[/b] " + t + " " + i + "\n";
                    bb_content += '[img]https://i.imgur.com/UqsrNy2.png[/img]';
                    var format_search = [
                        /<s>/mg,
                        /<\/s>/mg,
                        /<u>/mg,
                        /<\/u>/mg,
                        /<i>/mg,
                        /<\/i>/mg,
                        /<b>/mg,
                        /<\/b>/mg,
                        /<center>/mg,
                        /<\/center>/mg,
                        //\<b>(.*?)\<\/b\>/mg,
                        //\<i\>(.*?)\<\/i\>/ig,
                        //\<u\>(.*?)\<\/u\>/ig,
                        //\<s\>(.*?)\<\/s\>/ig,
                        //\<td\>\<center\>(.*?)\<\/center\>\<\/td\>/ig,
                        //\<center\>(.*?)\<\/center\>/ig,
                        /\<a class="bbcodes bbcodes_url".+href.+url=(.*?)".+\>(.*?)\<\/a>/ig,
                        /\<span class="bbcodes bbcodes_town"\>\<a href=\"#(.*?)" (.*?)>(.*?)<\/a><\/span>/ig,
                        /\<span class="bbcodes bbcodes_temple"\>\<a href=\"#(.*?)" (.*?)>(.*?)<\/a><\/span>/ig,
                        /\<img(.*?)src="https:\/\/gp-img.innogamescdn.com\/(.*?)?s=(.*?)"(.*?)>/ig,
                        /\<img src="(.*?)">/ig,
                        /\<span class="bbcodes bbcodes_color" style="color:(.*?)"\>(.*?)\<\/span\>/ig,
                        /\<span class="bbcodes bbcodes_island"><a href="(.*?)" (.*?)>(.*?) (.*?)<\/a><\/span>/ig,
                        /\<table.+\>\<tbody\>(.*?)\<\/tbody\>\<\/table\>/ig,
                        /\<a href="javascript.+\>(.*?)\<\/a\>/ig,
                        /\<tr\>\<td\>/ig,
                        /\<tr\>\<th\>/ig,
                        /\<\/td\>\<\/tr\>/ig,
                        /\<\/th\>\<\/tr\>/ig,
                        /\<\/td\>/ig,
                        /\<\/th\>/ig,
                        /\<td\>/ig,
                        /\<th\>/ig,
                        /\<span class="bbcodes bbcodes_font monospace">(.*?)<\/span>/ig,
                    ];
                    var format_replace = [
                        '[s]',
                        '[/s]',
                        '[u]',
                        '[/u]',
                        '[i]',
                        '[/i]',
                        '[b]',
                        '[/b]',
                        '[center]',
                        '[/center]',
                        //'[b]$1[/b]',
                        //'[i]$1[/i]',
                        //'[u]$1[/u]',
                        //'[s]$1[/s]',
                        //'[center]$1[/center]',
                        //'[center]$1[/center]',
                        '[url=$1]$2[/url]',
                        replaceBBtowns,
                        replaceBBtemple,
                        '[img]$2[/img]',
                        '[img]$1[/img]',
                        '[color=$1]$2[/color]',
                        '[island]$4[/island]',
                        '[table]$1[/table]',
                        '[b][color=#804000]$1[/color][/b]',
                        '[*]',
                        '[**]',
                        '[/*]',
                        '[/**]',
                        '[|]',
                        '[||]',
                        '',
                        '',
                        '[font=monospace]$1[/font]',
                    ];
                    function replaceBBtemple(match, p1, offset, string) {
                        var a = $.parseJSON(atob(p1));
                        return '[temple]' + a.id + '[/temple]'
                    };
                    function replaceBBtowns(match, p1, offset, string) {
                        var a = $.parseJSON(atob(p1));
                        return '[town]' + a.id + '[/town]'
                    };
                    function replaceBBislands(match, p1, offset, string) {
                        var a = $.parseJSON(atob(p1));
                        return '[island]' + a.id + '[/island]'
                    };
                    $(".message_post_container .message_post").each(function(index, element) {
                        var joe_messageExportTMP = $("#joe_messageExportTMP");
                        joe_messageExportTMP.empty();
                        var i, e, n = joe_messageExportTMP.html();
                        $(this).clone().appendTo(joe_messageExportTMP);
                        e = $(this)[0].outerHTML,
                            i = e,
                            $(this).hasClass("bbcodes_town") && (i = MessageExport.replaceTownNameById($(this).find("a"), i));
                        joe_messageExportTMP.find(".published_report").replaceWith("[report][/report]");
                        joe_messageExportTMP.find(".bbcode_awards").replaceWith("[img]https://i.imgur.com/xedCCJ0.gif[/img]");
                        joe_messageExportTMP.find(".reservation_list").replaceWith(function() {
                            if (MessageExport.bbcodes_town_id($(this).find("a.gp_town_link")) == false) {
                                joe_messageExportTMP.find(".reservation_list").replaceWith(function() {
                                    return '[reservation]9999999[/reservation]';
                                })
                            } else {
                                joe_messageExportTMP.find(".reservation_list").replaceWith(function() {
                                    return "[reservation]" + MessageExport.bbcodes_town_id($(this).find("a.gp_town_link")) + "[/reservation]";
                                })
                            }
                        });
                        joe_messageExportTMP.find(".bbcodes_spoiler").replaceWith(function() {
                            $(this).find(".button").remove();
                            return '[spoiler=' + $("b:first", this).text() + ']' + $(".bbcodes_spoiler_text", this).html() + '[/spoiler]';
                        });
                        joe_messageExportTMP.find(".bbcodes_quote").replaceWith(function() {
                            return '[quote=' + $('.quote_author', this).text().replace(' ' + getText("messages", "écrit"), '') + ']' + $(".quote_message", this).html() + '[/quote]';
                        });
                        joe_messageExportTMP.find(".bbcodes_size").replaceWith(function() {
                            return '[size=' + $(this)[0].style.fontSize + ']' + $(this).html() + '[/size]';
                        });
                        joe_messageExportTMP.find(".bbcodes_player").replaceWith(function() {
                            return '[player]' + $(this).text() + '[/player]';
                        });
                        joe_messageExportTMP.find(".bbcodes_ally").replaceWith(function() {
                            return '[ally]' + $(this).text() + '[/ally]';
                        });
                        joe_messageExportTMP.find(".bbcodes_ally_deleted").replaceWith(function() {
                            return '[ally]' + $(this).text() + '[/ally]';
                        });
                        joe_messageExportTMP.find(".bbcodes_font").replaceWith(function() {
                            return '[font=' + $(this).attr('class').split(' ').pop() + ']' + $(this).html() + '[/font]';
                        });
                        joe_messageExportTMP.find(".grepolis_score").replaceWith(function() {
                            return '[score]' + $(".bbcode_playername", this).text().trim() + '[/score]';
                        });
                        joe_messageExportTMP.find(".bbcode_application").replaceWith(function() {
                            return '[center][img]https://i.imgur.com/V3UKxXm.png[/img][/center][center]' + $(this).text().trim() + '[/center]';
                        });
                        joe_messageExportTMP.find("table").replaceWith(function() {
                            return '[table]' + $(this)[0].outerHTML + '[/table]';
                        });
                        joe_messageExportTMP.find("table").replaceWith(function() {
                            return $("tbody", this).html();
                        });
                        joe_messageExportTMP.find("script").remove();
                        var author = $(".message_poster .gp_player_link", this).text();
                        var postDate = $(".message_poster .message_date", this).text().trim();
                        bb_content += '[size=7][player]' + author + '[/player] ' + postDate + '[/size]\n';
                        bb_content += '[img]https://i.imgur.com/UqsrNy2.png[/img]\n';
                        var postHTML = $("#joe_messageExportTMP .message_post_content").html().trim();
                        postHTML = postHTML.replace(e, i)
                        postHTML = postHTML.replace(/(\r\n|\n|\r|\t)/gm, "");
                        postHTML = postHTML.replace(/<br\s*\/?>/mg, "\n");
                        postHTML = postHTML.replace(/%2B/mg, "+");
                        postHTML = postHTML.replace(/%2F/mg, "/");
                        postHTML = postHTML.replace(/%3A/mg, ":");
                        postHTML = postHTML.replace(/%3B/mg, ";");
                        postHTML = postHTML.replace(/%3D/mg, "=");
                        postHTML = postHTML.replace(/%3F/mg, "?");
                        postHTML = postHTML.replace(/%23/mg, "#");
                        postHTML = postHTML.replace(/%26/mg, "&");
                        postHTML = postHTML.replace(/&nbsp;/mg, " ");
                        p
                        for (var i = 0; i < format_search.length; i++) {
                            postHTML = postHTML.replace(format_search[i], format_replace[i]);
                        }
                        bb_content += postHTML + "\n";
                        bb_content += '[img]https://i.imgur.com/UqsrNy2.png[/img]';
                        bb_content += "\n";
                    });
                    bb_content += "[url=https://github.com/AligatorJoe/Dio-Tools-2019/raw/master/Gatinho.user.js]Gatinho[/url] - v." + version;
                    bb_content += "[/quote]";
                    var expRahmen_a = "<div class='inner_box'><div class='game_border'><div class='game_border_top'></div><div class='game_border_bottom'></div><div class='game_border_left'></div><div class='game_border_right'></div><div class='game_border_corner corner1'></div><div class='game_border_corner corner2'></div><div class='game_border_corner corner3'></div><div class='game_border_corner corner4'></div><div class='game_header bold' style='height:18px;'><div style='float:left; padding-right:10px;'></div>";
                    var expRahmen_b = "</div><textarea id='expTextarea' style=\"height: 225px; width: 685px;\">";
                    var expRahmen_c = "</textarea></div><center>" + joe.createButton(getText("messages", "copy"), "joe-copy-message-quote", null, 'data-clipboard-target="#expTextarea"') + "</center>";
                    var expRahmen_d = "<div style='overflow-x: hidden; padding-left: 5px; position: relative;'></div></div></div>";
                    var expRahmen_e = '<div id="joe_help_MessageExport" style="top: -37px;position: absolute; right: 33px;"><a class="ui-dialog-titlebar-help ui-corner-all" href=' + getText("link", "MessageExport") + ' target="_blank"></a></div>';
                    var expTitel = getText("messages", "Tol");
                    var BBwnd = GPWindowMgr.Create(GPWindowMgr.TYPE_JOE_BBCODEE) || GPWindowMgr.getOpenFirst(GPWindowMgr.TYPE_JOE_BBCODEE).close();
                    BBwnd.setContent(expRahmen_a + expTitel + expRahmen_b + bb_content + expRahmen_c + expRahmen_d + expRahmen_e);
                    $('#joe_help_MessageExport').tooltip('Wiki (' + getText("options", "Mse")[0] + ')');
                    $("#expTextarea").focus(function() {
                        var that = this;
                        setTimeout(function() {
                            $(that).select();
                        }, 10);
                    });
                });
            } catch (error) {
                errorHandling(error, "MessageExport");
            }
        },
        bbcodes_town_id: function(e) {
            var t = $(e).attr("href");
            return void 0 !== t && !1 !== t && "undefined" != (t = MessageExport.Link2Struct(t)).id && (t = parseInt(t.id),
                !isNaN(t)) && t
        },
        Link2Struct: function(l) {
            ret = {};
            try {
                l = l.split(/#/),
                    eval("ret=" + atob(l[1] || l[0]))
            } catch (e) {}
            return ret
        },
        addCopyListener: function() {
            new ClipboardJS("#joe-copy-message-quote").on("success", function() {
                setTimeout(function() {
                    HumanMessage.success(getText("messages", "copybb"))
                }, 50)
                GPWindowMgr.getOpenFirst(GPWindowMgr.TYPE_JOE_BBCODEE).close();
            })
        },
        replaceTownNameById: function(t, e) {
            var n = t.attr("href"),
                i = t.text();
            if (null != n && 0 <= n.indexOf("#")) {
                var o = JSON.parse(atob(n.replace("#", ""))).id;
                e = e.replace(">" + i + "<", ">" + o + "<")
            }
            return e
        },
        deactivate: function() {
            $('#joe_messageExport').remove();
        },
    };
    /////////////////////////////////////////
   //   * automatically/selects/units *   //
  /////////////////////////////////////////
    var SelectUnitsAuto = {
        activate: function() {
            try {
                var wnds = GPWindowMgr.getOpen(Layout.wnd.TYPE_TOWN);
                for (var e in wnds) {
                    if (wnds.hasOwnProperty(e)) {
                        var wndid = wnds[e].getID();
                        var testel = $('DIV#gpwnd_' + wndid + ' A.joe_balanced');
                        if (testel.length > 0) continue;
                        var handler = wnds[e].getHandler();
                        $('DIV#gpwnd_' + wndid + ' A.select_all_units').after(' | <a class="joe_balanced" title = "No overload" style="position: relative;background: url(https://gppt.innogamescdn.com/images/game/layout/alpha_sprite_2.69.png) no-repeat -321px -0px;display: inline-block;padding: 20px 0px 0px 32px;margin-bottom: -10px;" href="#"></a> | <a class="joe_delete" title = "Reset" style="background: url(https://gppt.innogamescdn.com/images/game/layout/alpha_sprite_2.69.png) no-repeat -377px -25px;display: inline-block;position: relative;margin-bottom: -12px;padding: 23px 0px 0px 24px;" href="#"></a>');
                        var joe_bl_groundUnits = new Array('sword', 'slinger', 'archer', 'hoplite', 'rider', 'chariot', 'catapult', 'minotaur', 'zyklop', 'medusa', 'cerberus', 'fury', 'centaur', 'calydonian_boar', 'godsent');
                        $('DIV#gpwnd_' + wndid + ' A.joe_balanced').click(function() {
                            var units = new Array();
                            var item;
                            for (var i = 0; i < joe_bl_groundUnits.length; i++) {
                                if (handler.data.units[joe_bl_groundUnits[i]]) {
                                    item = {
                                        name: joe_bl_groundUnits[i],
                                        count: handler.data.units[joe_bl_groundUnits[i]].count,
                                        population: handler.data.units[joe_bl_groundUnits[i]].population
                                    };
                                    units.push(item);
                                }
                            }
                            if (handler.data.researches && handler.data.researches.berth) {
                                var berth = handler.data.researches.berth;
                            } else {
                                var berth = 0;
                            }
                            var totalCap = handler.data.units.big_transporter.count * (handler.data.units.big_transporter.capacity + berth) + handler.data.units.small_transporter.count * (handler.data.units.small_transporter.capacity + berth);
                            units.sort(function(a, b) {
                                return b.population - a.population;
                            });
                            for (i = 0; i < units.length; i++) {
                                if (units[i].count == 0) {
                                    units.splice(i, 1);
                                    i = i - 1;
                                };
                            }
                            var restCap = totalCap;
                            var sendUnits = new Array();
                            for (i = 0; i < units.length; i++) {
                                item = {
                                    name: units[i].name,
                                    count: 0
                                };
                                sendUnits[units[i].name] = item;
                            };
                            var hasSent;
                            k = 0;
                            while (units.length > 0) {
                                hasSent = false;
                                k = k + 1;
                                for (i = 0; i < units.length; i++) {
                                    if (units[i].population <= restCap) {
                                        hasSent = true;
                                        units[i].count = units[i].count - 1;
                                        sendUnits[units[i].name].count = sendUnits[units[i].name].count + 1;
                                        restCap = restCap - units[i].population;
                                    }
                                }
                                for (i = 0; i < units.length; i++)
                                    if (units[i].count == 0) {
                                        units.splice(i, 1);
                                        i = i - 1;
                                    };
                                if (!hasSent) {
                                    break;
                                }
                            }
                            handler.getUnitInputs().each(function() {
                                if (!sendUnits[this.name]) {
                                    if (handler.data.units[this.name].count > 0)
                                        this.value = handler.data.units[this.name].count;
                                    else
                                        this.value = '';
                                }
                            });
                            for (i = 0; i < joe_bl_groundUnits.length; i++) {
                                if (sendUnits[joe_bl_groundUnits[i]]) {
                                    if (sendUnits[joe_bl_groundUnits[i]].count > 0)
                                        $('DIV#gpwnd_' + wndid + ' INPUT.unit_type_' + joe_bl_groundUnits[i]).val(sendUnits[joe_bl_groundUnits[i]].count);
                                    else
                                        $('DIV#gpwnd_' + wndid + ' INPUT.unit_type_' + joe_bl_groundUnits[i]).val('');
                                }
                            }
                            $('DIV#gpwnd_' + wndid + ' INPUT.unit_type_sword').trigger('change');
                        });
                        $('DIV#gpwnd_' + wndid + ' A.joe_delete').click(function() {
                            handler.getUnitInputs().each(function() {
                                this.value = '';
                            });
                            $('DIV#gpwnd_' + wndid + ' INPUT.unit_type_sword').trigger('change');
                        });
                    }
                }
            } catch (error) {
                errorHandling(error, "SelectUnitsAuto");
            }
        },
        deactivate: function() {},
    };
    ///////////////////////////////////
   //   * player/alliance/BBCode *  //
  ///////////////////////////////////
    var BBTownPlayer = {
        activate: function() {
            var wnds = GPWindowMgr.getOpen(Layout.wnd.TYPE_TOWN);
            for (var e in wnds) {
                if (wnds.hasOwnProperty(e)) {
                    var wndid = wnds[e].getID();
                    $('<style id="joe_BBtowninfo_style"> ' +
                        '#joe_' + wndid + 'BBplayer { background: url(https://gpfr.innogamescdn.com/images/game/autogenerated/common/bbcodes/bbcodes_6e4f630.png) no-repeat -207px -28px; position:absolute; height: 22px; width: 21px; top:1px ;left: 0px; } ' +
                        '#joe_' + wndid + 'BBalliance { background: url(https://gpfr.innogamescdn.com/images/game/autogenerated/common/bbcodes/bbcodes_6e4f630.png) no-repeat -207px -5px; position:absolute; height: 22px; width: 21px; top:1px ;left: 0px;z-index: 555; } ' +
                        '#joe_' + wndid + 'clipboard-player { background: rgba(0, 0, 0, 0) url("https://gppt.innogamescdn.com/images/game/autogenerated/layout/layout_596941d.png") no-repeat scroll -482px -647px; position:absolute; height: 18px; width: 18px; z-index: 555; top:4px ;left: 229px; } ' +
                        '#joe_' + wndid + 'clipboard-alliance { background: rgba(0, 0, 0, 0) url("https://gppt.innogamescdn.com/images/game/autogenerated/layout/layout_596941d.png") no-repeat scroll -482px -647px; position:absolute; height: 18px; width: 18px; z-index: 555; top:4px ;left: 229px; } ' +
                        '#joe_' + wndid + 'clipboard-player:hover { filter: drop-shadow(0 0mm 2mm rgb(0, 210, 53)); } ' +
                        '#joe_' + wndid + 'clipboard-alliance:hover { filter: drop-shadow(0 0mm 2mm rgb(0, 210, 53)); } ' +
                        '#input_' + wndid + 'BBplayer { display: none; position: absolute; left: 40px; top: 4px; width: 200px; height: 12px; text-align: center; z-index: 555; background-image: url(https://gppt.innogamescdn.com/images/game/layout/gpwindow_bg.jpg); color: #0070ff; font-weight: bold; font-size: 10px;} ' +
                        '#input_' + wndid + 'BBalliance { display: none; position: absolute; left: 40px; top: 4px; width: 200px; height: 12px; text-align: center; z-index: 555; background-image: url(https://gppt.innogamescdn.com/images/game/layout/gpwindow_bg.jpg); color: #0070ff; font-weight: bold; font-size: 10px;} ' +
                        '</style>').appendTo("head");
                    if ($("div#gpwnd_" + wndid + " div#info_tab_content div#towninfo_towninfo div.game_border ul.game_list li.even div.list_item_left a.gp_player_link").is(':visible')) {
                        $('<style id="joe_BBplayer_style"> ' +
                            'div#gpwnd_' + wndid + ' div#info_tab_content div#towninfo_towninfo div.game_border ul.game_list li.even img { padding-left: 21px; } ' +
                            'div#gpwnd_' + wndid + ' div#info_tab_content div#towninfo_towninfo div.game_border ul.game_list li.odd.clearfix { padding-left: 25px; } ' +
                            '</style>').appendTo("head");
                    } else {
                        $('<style id="joe_BBplayer_style"> ' +
                            'div#gpwnd_' + wndid + ' div#info_tab_content div#towninfo_towninfo div.game_border ul.game_list li.even img { padding-left: 0px; } ' +
                            '</style>').appendTo("head");
                    }
                    if (!$('#joe_' + wndid + 'BBplayer').get(0)) {
                        if ($("div#gpwnd_" + wndid + " div#info_tab_content div#towninfo_towninfo div.game_border ul.game_list li.even div.list_item_left a.gp_player_link").is(':visible')) {
                            $('<a id="joe_' + wndid + 'BBplayer"></a><input id="input_' + wndid + 'BBplayer" type="text" onfocus="this.select();" onclick="this.select();"></div>').appendTo('div#gpwnd_' + wndid + ' div#info_tab_content div#towninfo_towninfo div.game_border ul.game_list li.even div.list_item_left');
                            $("#joe_" + wndid + "BBplayer").click(function() {
                                if ($('#joe_' + wndid + 'clipboard-player').is(':visible')) {
                                    $('#joe_' + wndid + 'clipboard-player').remove();
                                } else {
                                    $('<a id="joe_' + wndid + 'clipboard-player" data-clipboard-text="[player]' + $("div#gpwnd_" + wndid + " div#info_tab_content div#towninfo_towninfo div.game_border ul.game_list li.even div.list_item_left a.gp_player_link").text().trim() + '[/player]"></a>').appendTo('div#gpwnd_' + wndid + ' div#info_tab_content div#towninfo_towninfo div.game_border ul.game_list li.even div.list_item_left').tooltip(getText("messages", "copy"));
                                }
                                $("#input_" + wndid + "BBplayer").toggle();
                                $("#input_" + wndid + "BBplayer").val("[player]" + $("div#gpwnd_" + wndid + " div#info_tab_content div#towninfo_towninfo div.game_border ul.game_list li.even div.list_item_left a.gp_player_link").text().trim() + "[/player]");
                            });
                        }
                        $('<a id="joe_' + wndid + 'BBalliance"></a><input id="input_' + wndid + 'BBalliance" type="text" onfocus="this.select();" onclick="this.select();"></div>').appendTo('div#gpwnd_' + wndid + ' div#info_tab_content div#towninfo_towninfo div.game_border ul.game_list li.odd.clearfix');
                        $("#joe_" + wndid + "BBalliance").click(function() {
                            if ($('#joe_' + wndid + 'clipboard-alliance').is(':visible')) {
                                $('#joe_' + wndid + 'clipboard-alliance').remove();
                            } else {
                                $('<a id="joe_' + wndid + 'clipboard-alliance" data-clipboard-text="[ally]' + $("div#gpwnd_" + wndid + " div#info_tab_content div#towninfo_towninfo div.game_border ul.game_list li.odd.clearfix a").text().trim() + '[/ally]"></a>').appendTo('div#gpwnd_' + wndid + ' div#info_tab_content div#towninfo_towninfo div.game_border ul.game_list li.odd.clearfix').tooltip(getText("messages", "copy"));
                            }
                            $("#input_" + wndid + "BBalliance").toggle();
                            $("#input_" + wndid + "BBalliance").val("[ally]" + $("div#gpwnd_" + wndid + " div#info_tab_content div#towninfo_towninfo div.game_border ul.game_list li.odd.clearfix a").text().trim() + "[/ally]");
                        });
                        new ClipboardJS("#joe_" + wndid + "clipboard-player").on("success", function() {
                            setTimeout(function() {
                                HumanMessage.success(getText("messages", "copybb"))
                            }, 50)
                        })
                        new ClipboardJS("#joe_" + wndid + "clipboard-alliance").on("success", function() {
                            setTimeout(function() {
                                HumanMessage.success(getText("messages", "copybb"))
                            }, 50)
                        })
                    }
                }
            }
            $('#joe_' + wndid + 'BBplayer').tooltip(joe_icon + 'BBCode ' + DM.getl10n("bbcodes").player.name);
            $('#joe_' + wndid + 'BBalliance').tooltip(joe_icon + 'BBCode ' + DM.getl10n("bbcodes").ally.name);
        },
        deactivate: function() {
            $('#joe_BBTownPlayer_style').remove();
            $('#joe_BBplayer_style').remove();
        },
    };
    ///////////////////////////////////
   //      * Activity boxes *       //
  ///////////////////////////////////
    var ActivityBoxes = {
        activate: function() {
            try {
                $("#toolbar_activity_recruits_list").hover(
                    function() {
                        if ($("#joe_plusmenuRecruits").length == 0) {
                            $("#toolbar_activity_recruits_list").append('<div id="joe_plusmenuRecruits" class="joe_plusmenu"><div id="joe_plusdraghandleRecruits" class="joe_plusdraghandle"></div><a class="joe_plusback"></a></div>');
                            $('#joe_plusmenuRecruits .joe_plusback').click(function() {
                                joe_plus_destroy("joe_plusmenuRecruits");
                            });
                        }
                    },
                    function() {
                        $('#joe_plusmenuRecruits').remove();
                    });
                $("#toolbar_activity_trades_list").hover(
                    function() {
                        if ($("#joe_plusmenuTrades").length == 0) {
                            $("#toolbar_activity_trades_list").append('<div id="joe_plusmenuTrades" class="joe_plusmenu"><div id="joe_plusdraghandleTrades" class="joe_plusdraghandle"></div><a class="joe_plusback"></a></div>');
                            $('#joe_plusmenuTrades .joe_plusback').click(function() {
                                joe_plus_destroy("joe_plusmenuTrades");
                            });
                        }
                    },
                    function() {
                        $('#joe_plusmenuTrades').remove();
                    });
                $("#toolbar_activity_temple_commands_list").hover(
                    function() {
                        if ($("#joe_plusmenuTemple_commands").length == 0) {
                            $("#toolbar_activity_temple_commands_list").append('<div id="joe_plusmenuTemple_commands" class="joe_plusmenu"><div id="joe_plusdraghandleTemple_commands" class="joe_plusdraghandle"></div><a class="joe_plusback"></a></div>');
                            $('#joe_plusmenuTemple_commands .joe_plusback').click(function() {
                                joe_plus_destroy("joe_plusmenuTemple_commands");
                            });
                        }
                    },
                    function() {
                        $('#joe_plusmenuTemple_commands').remove();
                    });
                $('<style id="joe_plusmenustyle" type="text/css">' +
                    '.displayImp {display: block !important}' +
                    '.joe_plusmenu {margin:6px 22px 2px 5px;height:11px;display:block;position:relative}' +
                    '.joe_plusdraghandle {width:100%;height:11px;position:absolute;background:url(https://i.ibb.co/74WtWbV/grille.png)}' +
                    '.joe_plusback {right:-18px;margin-top:-1px;width:16px;height:12px;position:absolute;background:url(https://i.ibb.co/8mCL0TR/plusback.png)}' +
                    '#toolbar_activity_recruits_list {min-width: 113px;}' +
                    '</style>').appendTo('head');
                $('#toolbar_activity_recruits_list').draggable({
                    cursor: "move",
                    handle: ".joe_plusdraghandle",
                    start: function() {
                        $("#joe_plusmenuRecruitsSTYLE").remove();
                        $('#toolbar_activity_recruits_list').addClass("displayImp");
                    },
                    stop: function() {
                        var joe_position = $('#toolbar_activity_recruits_list').position();
                        $('<style id="joe_plusmenuRecruitsSTYLE" type="text/css">#toolbar_activity_recruits_list {left: ' + joe_position.left + 'px !important;top: ' + joe_position.top + 'px !important}</style>').appendTo('head');
                    }
                });
                $('#toolbar_activity_trades_list').draggable({
                    cursor: "move",
                    handle: ".joe_plusdraghandle",
                    start: function() {
                        $("#joe_plusmenuTradesSTYLE").remove();
                        $('#toolbar_activity_trades_list').addClass("displayImp");
                    },
                    stop: function() {
                        var joe_position = $('#toolbar_activity_trades_list').position();
                        $('<style id="joe_plusmenuTradesSTYLE" type="text/css">#toolbar_activity_trades_list {left: ' + joe_position.left + 'px !important;top: ' + joe_position.top + 'px !important}</style>').appendTo('head');
                    }
                });
                $('#toolbar_activity_temple_commands_list').draggable({
                    cursor: "move",
                    handle: ".joe_plusdraghandle",
                    start: function() {
                        $("#joe_plusmenuTemple_commandsSTYLE").remove();
                        $('#toolbar_activity_temple_commands_list').addClass("displayImp");
                    },
                    stop: function() {
                        var joe_position = $('#toolbar_activity_temple_commands_list').position();
                        $('<style id="joe_plusmenuTemple_commandsSTYLE" type="text/css">#toolbar_activity_temple_commands_list {left: ' + joe_position.left + 'px !important;top: ' + joe_position.top + 'px !important}</style>').appendTo('head');
                    }
                });

                function joe_plus_destroy(joeJQselector) {

                    $("#" + joeJQselector).parent().removeClass("displayImp");
                    $("#" + joeJQselector + "STYLE").remove();
                }
            } catch (error) {
                errorHandling(error, "ForumDeleteMultiple");
            }
        },
        deactivate: function() {
            $('#joe_plusmenustyle').remove();
            $('#joe_plusmenuRecruits').remove();
            $("#joe_plusmenuRecruitsSTYLE").remove();
            $('#joe_plusmenuTrades').remove();
            $('#joe_plusmenuTradesSTYLE').remove();
            $('#joe_plusmenuTemple_commands').remove();
            $("#joe_plusmenuTemple_commandsSTYLE").remove();
            $('#toolbar_activity_recruits_list').click(function() {
                joe_plus_destroy("joe_plusmenuRecruits");
            });
            $('#toolbar_activity_trades_list').click(function() {
                joe_plus_destroy("joe_plusmenuTrades");
            });
            $('#toolbar_activity_temple_commands_list').click(function() {
                joe_plus_destroy("joe_plusmenuTemple_commands");
            });

            function joe_plus_destroy(joeJQselector) {
                $("#" + joeJQselector).parent().removeClass("displayImp");
                $("#" + joeJQselector + "STYLE").remove();
            }
        },
    };
    ///////////////////////////////////
   //        * Towns BBCode *       //
  ///////////////////////////////////
    var Townbb = {
        activate: function() {
            Townbb.addButton();
            $('<style id="joe_townbb_style"> ' +
                '#joe_townbb { background: url("https://i.imgur.com/BoAdRfl.png") -23px 0px transparent; position:absolute; height: 22px; width: 21px; top:26px; left:184px; z-index:200; } ' +
                '#joe_townbb:hover { background: url("https://i.imgur.com/BoAdRfl.png") -23px -23px transparent; position:absolute; height: 22px; width: 21px; top:26px; left:184px; z-index:5; } ' +
                '#joe_townbb_logo { background: url(""); position: absolute; height: 30px; width: 30px; left:180px; top:27px; } ' +
                '#joe_townbb-clipboard:hover { filter: drop-shadow(0 0mm 2mm rgb(0, 210, 53)); } ' +
                '#input_townbb { display: none; position: absolute; left: 23px; top: 29px; width: 157px; height: 12px; text-align: center; z-index: 5;  background: url(https://gppt.innogamescdn.com/images/game/autogenerated/layout/layout_596941d.png) no-repeat -170px -286px; color: #0070ff; } ' +
                '#joe_townbb-clipboard { background: rgba(0, 0, 0, 0) url("https://gppt.innogamescdn.com/images/game/autogenerated/layout/layout_596941d.png") no-repeat scroll -482px -647px; position: absolute; height: 18px; width: 18px; z-index: 555; top: 29px; left: 167px; } ' +
                '</style>').appendTo("head");
        },
        deactivate: function() {
            $('#joe_townbb').remove();
            $('#joe_townbb_style').remove();
            $('#input_townbb').remove();
        },
        addButton: function() {
            $('<a id="joe_townbb"></a><input id="input_townbb" type="text" onfocus="this.select();" onclick="this.select();"><div id="joe_townbb_logo"></div>').appendTo('.town_name_area');
            $("#joe_townbb").click(function() {
                if ($('#joe_townbb-clipboard').is(':visible')) {
                    $('#joe_townbb-clipboard').remove();
                } else {
                    $('<a id="joe_townbb-clipboard" data-clipboard-text="[town]' + Game.townId + '[/town]"></a>').appendTo('.town_name_area').tooltip(getText("messages", "copy"));
                }
                $("#input_townbb").toggle();
                $("#input_townbb").val("[town]" + Game.townId + "[/town]");
            });
            new ClipboardJS("#joe_townbb-clipboard").on("success", function() {
                setTimeout(function() {
                    HumanMessage.success(getText("messages", "copybb"))
                }, 50)
            })
            $('#joe_townbb').tooltip(joe_icon + getText("labels", "BBV"));
            $('#joe_townbb-clipboard').tooltip(joe_icon + 'BBCode ' + DM.getl10n("market").city);
        },
    };
    ///////////////////////////////////
   //          * city view *        //
  ///////////////////////////////////
    var city_view_cvw = {
        activate: function() {
            $('<style id="joe_city_longe_style"> ' +
                '.nui_main_menu .content ul li { height: 31px; } ' +
                '.nui_main_menu .content ul li.first { height: 28px; } ' +
                '</style>').appendTo("head");
            $('#ui_box .nui_main_menu .middle .content ul li[data-option-id=cityview]').remove();
            $('#ui_box .nui_main_menu .middle .content ul li[data-option-id=messages]').removeClass("first");
            $('#ui_box .nui_main_menu .middle .content ul li[data-option-id=GRM_button]').addClass("messages main_menu_item first");
            $('#ui_box .nui_main_menu .middle .content ul').not("ul li ul").prepend('<div id="joe_cityview_style"><li data-option-id="joe_cityview" class="messages main_menu_item first"><span class="content_wrapper"><span class="button_wrapper" style="opacity: 1;"><span class="button"><span class="icon" style="background:url(https://gppt.innogamescdn.com/images/game/autogenerated/layout/layout_596941d.png) no-repeat -613px -380px"></span><span class="indicator" style="display: none;">0</span></span></span><span class="name_wrapper" style="opacity: 1;"><span class="name">' + getText("grepo_mainmenu", "island_view") + '</span></span></span></li></div>');
            function joe_island_overview() {
                $('#ui_box .nui_main_menu .middle .content ul li[data-option-id=joe_cityview] .icon').css({
                    "background": "url(https://gppt.innogamescdn.com/images/game/autogenerated/layout/layout_596941d.png) no-repeat -613px -380px",
                    "top": "8px",
                    "left": "5px"
                });
                $('#ui_box .nui_main_menu .middle .content ul li[data-option-id=joe_cityview] .name').text(getText("grepo_mainmenu", "island_view"));
            }
            function joe_city_overview() {
                $('#ui_box .nui_main_menu .middle .content ul li[data-option-id=joe_cityview] .icon').css({
                    "background": "url(https://gppt.innogamescdn.com/images/game/autogenerated/layout/layout_596941d.png) no-repeat -645px -380px",
                    "top": "6px",
                    "left": "6px"
                });
                $('#ui_box .nui_main_menu .middle .content ul li[data-option-id=joe_cityview] .name').text(getText("grepo_mainmenu", "city_view"));
            }
            $.Observer(GameEvents.ui.bull_eye.radiobutton.city_overview.click).subscribe('joe_city_overview', function(e, data) {
                joe_island_overview();
            });
            $.Observer(GameEvents.ui.bull_eye.radiobutton.island_view.click).subscribe('joe_island_view', function(e, data) {
                joe_city_overview();
            });
            $.Observer(GameEvents.ui.bull_eye.radiobutton.strategic_map.click).subscribe('joe_strategic_map', function(e, data) {
                joe_city_overview();
            });
            $('#ui_box .nui_main_menu .middle .content ul li[data-option-id=joe_cityview]').click(function() {
                if (!$("#ui_box .bull_eye_buttons .city_overview").hasClass('checked')) {
                    $("#ui_box .bull_eye_buttons .city_overview").click();
                } else {
                    $("#ui_box .bull_eye_buttons .island_view").click();
                }
            });
        },
        deactivate: function() {
            $('#joe_cityview').remove();
            $('#joe_cityview_style').remove();
            $('#joe_city_longe_style').remove();
            $("#ui_box .nui_main_menu .middle .content ul li[data-option-id=messages]").addClass('first');
        },
    };
    var city_view_window = {
        activate: function() {
            $('<style id="joe_city_view_style"> ' +
                '.ui-dialog.ui-corner-all.ui-widget.ui-widget-content.ui-front.ui-draggable.ui-resizable.js-window-main-container { left: 850px; top: 150px; } ' +
                '#ui_box.city-overview-enabled .skip_tutorial.minimized_windows {bottom: 35px; } ' +
                '#ui_box.city-overview-enabled .skip_tutorial {bottom: 0px; } ' +
                '.ui_construction_queue.minimized_windows {bottom: -3px; } ' +
                '</style>').appendTo("head");

            function WndHandlerJOEtownoverview(wndhandle) {
                this.wnd = wndhandle;
            }
            Function.prototype.inherits.call(WndHandlerJOEtownoverview, WndHandlerDefault);
            WndHandlerJOEtownoverview.prototype.getDefaultWindowOptions = function() {
                return {
                    position: ["center", "center"],
                    height: 600,
                    width: 800,
                    minimizable: true,
                    title: "" + getText("grepo_mainmenu", "city_view") + " - " + Game.townName + ""
                };
            };
            WndHandlerJOEtownoverview.prototype.onClose = function() {
                $('#ui_box').append($('DIV.ui_city_overview')).append($('DIV.ui_construction_queue'));
                if ($("#minimap_canvas").hasClass('expanded')) {
                    $.Observer(GameEvents.ui.bull_eye.radiobutton.strategic_map.click).publish({});
                } else {
                    $.Observer(GameEvents.ui.bull_eye.radiobutton.island_view.click).publish({});
                }
            };
            GPWindowMgr.addWndType("JOE_TOWNOVERVIEW", "joe_townoverview", WndHandlerJOEtownoverview, 1);
            $.Observer(GameEvents.ui.bull_eye.radiobutton.city_overview.click).subscribe('joe_city_overview_window', function Felix(e, data) {
                if (DATA.options.Ciw) {
                    var city_wnd = GPWindowMgr.getOpenFirst(Layout.wnd.TYPE_JOE_TOWNOVERVIEW);
                    if (city_wnd) {
                        city_wnd.setTitle("" + getText("grepo_mainmenu", "city_view") + " - " + Game.townName + "");
                        return;
                    }
                    var html = '<div id="joe_townoverview"></div>';
                    var wnd = GPWindowMgr.Create(GPWindowMgr.TYPE_JOE_TOWNOVERVIEW) || GPWindowMgr.getOpenFirst(GPWindowMgr.TYPE_JOE_TOWNOVERVIEW);
                    wnd.setContent(html);
                    wnd.setTitle("" + getText("grepo_mainmenu", "city_view") + " - " + Game.townName + "");
                    var JQel = wnd.getJQElement();
                    JQel.find(".gpwindow_content").css({
                        "overflow": "hidden",
                        "border": "1px solid black"
                    });
                    JQel.find('#joe_townoverview').append($('DIV.ui_city_overview')).append($('DIV.ui_construction_queue'));
                    $('DIV.ui_city_overview .town_background').css({
                        "transform": "translate(-597px, -315px)"
                    });
                }
            });
            $("#ui_box .bull_eye_buttons .rb_map").on("rb:change:value", function(e, value, old_value) {
                if (value === 'island_view' || value === 'strategic_map') {
                    var wnd = GPWindowMgr.getOpenFirst(Layout.wnd.TYPE_JOE_TOWNOVERVIEW);
                    if (!wnd)
                        return;
                    wnd.close();
                }
            });
        },
        deactivate: function() {
            $('#joe_city_view_style').remove();
        },
    };
    ///////////////////////////////////
   //       * Political Map *       //
  ///////////////////////////////////
    var PoliticalMap = {
        data: null,
        activate: function() {
            $('<div id="joe_political_map">' +
                '<div class="canvas_wrapper"></div>' +
                '<select class="zoom_select">' +
                '<option value="0.50">1 : 0.50</option>' +
                '<option value="0.75">1 : 0.75</option>' +
                '<option value="1.00" selected>1 : 1.00</option>' +
                '<option value="1.25">1 : 1.25</option>' +
                '<option value="1.50">1 : 1.50</option>' +
                '<option value="2.00">1 : 2.00</option>' +
                '<option value="3.00">1 : 3.00</option>' +
                '</select>' +
                '<div class="legend sandy-box">' +
                '<div class="corner_tl"></div>' +
                '<div class="corner_tr"></div>' +
                '<div class="corner_bl"></div>' +
                '<div class="corner_br"></div>' +
                '<div class="border_t"></div>' +
                '<div class="border_b"></div>' +
                '<div class="border_l"></div>' +
                '<div class="border_r"></div>' +
                '<div class="middle"></div>' +
                '<div class="content"><div class="item"></div></div>' +
                '</div></div>').appendTo('#ui_box');
            $('<style id="joe_political_map_style">' +
                '#joe_political_map { width:100%; height:100%; z-index:3; background:#123d70; display:none; position:absolute; top:0; } ' +
                '#joe_political_map.active { display: block; } ' +
                '#joe_political_map .canvas_wrapper { } ' +
                '#joe_political_map canvas { position: absolute; cursor:move; top:0; left:0; } ' +
                '#joe_political_map .zoom_select { position:absolute; top:70px; left:300px; font-size: 2em; opacity:0.5; } ' +
                '#joe_political_map .zoom_select:hover { opacity:1; } ' +
                '#joe_political_map .legend { position:absolute; right:200px; top:50px; width:200px; height:auto; text-align:left; } ' +
                '#joe_political_map .legend .color_checker { width:15px; height:15px; float:left; border:1px solid rgb(100, 100, 0); margin:5px; position:relative; cursor:pointer; } ' +
                '#joe_political_map .legend .wonder_icon { float: left; margin: 4px; } ' +
                '.btn_political_map { top:56px; left:-4px; z-index:10; position:absolute; } ' +
                '.btn_political_map .ico_political_map { margin:7px 0px 0px 8px; width:17px; height:17px; background:url(https://i.imgur.com/wsmJMqz.png) no-repeat 0px 0px; background-size:100%; } ' +
                '.btn_political_map .ico_political_map.checked { margin-top:8px; } ' +
                '</style>').appendTo('head');
            PoliticalMap.addButton();
            var zoomSelect = $('.zoom_select');
            zoomSelect.change(function() {});
            zoomSelect.on("change", function() {
                PoliticalMap.zoomToCenter();
            });
            ColorPicker.init();
        },
        deactivate: function() {
            $('.btn_political_map').remove();
            $('#joe_political_map_style').remove();
        },
        addButton: function() {
            var m_ZoomFactor = 1.0;
            $('<div class="btn_political_map circle_button" name="political_map"><div class="ico_political_map js-caption"></div></div>').appendTo(".bull_eye_buttons");
            var politicalMapButton = $('.btn_political_map');
            politicalMapButton.tooltip("Political Map");
            politicalMapButton.on('mousedown', function() {}).on('mouseup', function() {});
            $('.rb_map .option').click(function() {
                $('.btn_political_map, .ico_political_map').removeClass("checked");
                $('#joe_political_map').removeClass("active");
                $(this).addClass("checked");
            });
            politicalMapButton.click(function() {
                $('.rb_map .checked').removeClass("checked");
                $('.btn_political_map, .ico_political_map').addClass("checked");
                $('#joe_political_map').addClass("active");
                if ($('#joe_political_map').hasClass("active")) {
                    if (PoliticalMap.data == null) {
                        $('#ajax_loader').css({
                            visibility: "visible"
                        });
                        PoliticalMap.loadMapData();
                    } else {}
                }
            });
        },
        loadMapData: function() {
            $.ajax({
                type: "GET",
                url: "https://felix.de/php/map.php?world_id=" + WID + "&callback=jsonCallback",
                success: function(response) {
                    if (response !== "") {
                        PoliticalMap.data = response;
                        var m_ZoomFactor = $('.zoom_select').get(0)[$('.zoom_select').get(0).selectedIndex].selected;
                        PoliticalMap.drawMap(PoliticalMap.data, m_ZoomFactor);
                        PoliticalMap.drawWonders(PoliticalMap.data, m_ZoomFactor);
                        $('#ajax_loader').css({
                            visibility: "hidden"
                        });
                        $.ajax({
                            type: "GET",
                            url: "https://felix.de/php/update_db.php?world_id=" + WID
                        });
                    } else {
                        $.ajax({
                            type: "GET",
                            url: "https://felix.de/php/update_db.php?world_id=" + WID,
                            success: function() {
                                $.ajax({
                                    type: "GET",
                                    url: "https://felix.de/php/map.php?world_id=" + WID,
                                    success: function(response) {
                                        PoliticalMap.data = response;
                                        var m_ZoomFactor = $('.zoom_select').get(0)[$('.zoom_select').get(0).selectedIndex].selected;
                                        PoliticalMap.drawMap(PoliticalMap.data, m_ZoomFactor);
                                        PoliticalMap.drawWonders(PoliticalMap.data, m_ZoomFactor);
                                        $('#ajax_loader').css({
                                            visibility: "hidden"
                                        });
                                    }
                                });
                            }
                        });
                    }
                }
            });
        },
        zoomToCenter: function() {
            var _zoom = $('.zoom_select').get(0)[$('.zoom_select').get(0).selectedIndex].value;
            var canvas = $('#joe_political_map canvas'),
                canvas_size = parseInt($('#joe_political_map canvas').width(), 10);
            var canvas_style = $('#joe_political_map .canvas_wrapper').get(0).style;
            canvas_style.top = parseInt(canvas_style.top, 10) + (1000 * (canvas_size / 1000 - _zoom)) / 2 + "px";
            canvas_style.left = parseInt(canvas_style.left, 10) + (1000 * (canvas_size / 1000 - _zoom)) / 2 + "px";
            PoliticalMap.clearMap();
            PoliticalMap.drawMap(PoliticalMap.data, _zoom);
            PoliticalMap.drawWonders(PoliticalMap.data, _zoom);
        },
        zoomToCursorPosition: function(_zoom, _pos) {},
        drawMap: function(_islandArray, _zoom) {
            $('<canvas class="canv_map" height="' + (1000 * _zoom) + 'px" width="' + (1000 * _zoom) + "px\"></canvas>").prependTo('.canvas_wrapper')
            $('#joe_political_map .canvas_wrapper').draggable({
                distance: 10,
                grid: [100 * _zoom, 100 * _zoom],
                cursor: 'pointer'
            });
            var ally_ranking = JSON.parse(_islandArray)['ally_ranking'];
            var island_array = JSON.parse(_islandArray)['ally_island_array'];
            var c = $('#joe_political_map .canv_map')[0].getContext('2d');
            c.strokeStyle = 'rgb(0,100,0)';
            for (var l = 0; l <= 10; l++) {
                c.moveTo(0, l * 100 * _zoom);
                c.lineTo(1000 * _zoom, l * 100 * _zoom);
                c.stroke();
                c.moveTo(l * 100 * _zoom, 0);
                c.lineTo(l * 100 * _zoom, 1000 * _zoom);
                c.stroke();
            }
            c.beginPath();
            c.arc(500 * _zoom, 500 * _zoom, 100 * _zoom, 0, Math.PI * 2, true);
            c.fillStyle = 'rgba(0,100,0,0.2)';
            c.fill();
            c.stroke();
            c.fillStyle = 'rgb(0,100,0)';
            for (var y = 0; y <= 10; y++) {
                for (var x = 0; x <= 10; x++) {
                    c.fillText(y + "" + x, y * 100 * _zoom + 2, x * 100 * _zoom + 10);
                }
            }
            var colorArray = ["#00A000", "yellow", "red", "rgb(255, 116, 0)", "cyan", "#784D00", "white", "purple", "#0078FF", "deeppink", "darkslategrey"];
            for (var t in island_array) {
                if (island_array.hasOwnProperty(t)) {
                    var tmp_points = 0,
                        dom_ally = "";
                    for (var ally in island_array[t]) {
                        if (island_array[t].hasOwnProperty(ally)) {
                            if (tmp_points < island_array[t][ally] && (ally !== "X") && (ally !== "")) {
                                tmp_points = island_array[t][ally];
                                dom_ally = ally;
                            }
                        }
                    }
                    c.fillStyle = colorArray[parseInt(ally_ranking[dom_ally], 10) - 1] || "darkslategrey";
                    if (c.fillStyle !== "#2f4f4f") {
                        var color = c.fillStyle;
                        var radgrad = c.createRadialGradient(t.split("x")[0] * _zoom + 1, t.split("x")[1] * _zoom + 1, 0, t.split("x")[0] * _zoom + 1, t.split("x")[1] * _zoom + 1, 10);
                        radgrad.addColorStop(0, PoliticalMap.convertHexToRgba(color, 0.2));
                        radgrad.addColorStop(0.6, PoliticalMap.convertHexToRgba(color, 0.2));
                        radgrad.addColorStop(1, PoliticalMap.convertHexToRgba(color, 0.0));
                        c.fillStyle = radgrad;
                        c.fillRect(t.split("x")[0] * _zoom - 10, t.split("x")[1] * _zoom - 10, 22, 22);
                        c.fillStyle = PoliticalMap.convertHexToRgba(color, 0.7);
                        c.fillRect(t.split("x")[0] * _zoom, t.split("x")[1] * _zoom, 3 * _zoom, 3 * _zoom);
                    } else {
                        c.fillRect(t.split("x")[0] * _zoom, t.split("x")[1] * _zoom, 3 * _zoom, 3 * _zoom);
                    }
                }
            }
            var legend = $('#joe_political_map .legend .content');
            legend.get(0).innerHTML = "";
            for (var ally in ally_ranking) {
                if (ally_ranking.hasOwnProperty(ally)) {
                    if (ally_ranking[ally] > 10) {
                        legend.append("<div class='item' style='color:" + colorArray[ally_ranking[ally] - 1] + "'><div class='color_checker' style='background-color:" + colorArray[ally_ranking[ally] - 1] + "'></div>...</div>");
                        break;
                    } else {
                        legend.append("<div class='item' style='color:" + colorArray[ally_ranking[ally] - 1] + "'><div class='color_checker' style='background-color:" + colorArray[ally_ranking[ally] - 1] + "'></div>" + ally + "</div>");

                    }
                }
            }
            $('#joe_political_map .legend .color_checker').click(function(event) {
                var x = event.pageX - this.offsetLeft;
                var y = event.pageY - this.offsetTop;
                console.debug("Color Checker", event.pageX, this.offsetLeft);
                ColorPicker.open(x, y);
            });
            $(ColorPicker).on("onColorChanged", function(event, color) {
                console.debug("Farbe setzen", event, color);
                $.ajax({
                    type: "POST",
                    url: "https://" + Game.world_id + ".grepolis.com/game/alliance?town_id=" + Game.townId + "&action=assign_map_color&h=" + Game.csrfToken,
                    data: {
                        "json": "{\"alliance_id\":\"217\",\"color\":" + color + ",\"player_id\":\"8512878\",\"town_id\":\"71047\",\"nl_init\":true}"
                    },
                    success: function(response) {
                        console.debug("Erfolgreich übertragen", response);
                    }
                });
            });
        },
        convertHexToRgba: function(hex, opacity) {
            console.debug("hex", hex);
            hex = hex.replace('#', '');
            r = parseInt(hex.substring(0, 2), 16);
            g = parseInt(hex.substring(2, 4), 16);
            b = parseInt(hex.substring(4, 6), 16);
            result = 'rgba(' + r + ',' + g + ',' + b + ',' + opacity + ')';
            return result;
        },
        drawWonders: function(_islandArray, _zoom) {
            $('<canvas class="canv_ww" height="' + (1000 * _zoom) + 'px" width="' + (1000 * _zoom) + 'px"></canvas>').appendTo('.canvas_wrapper')
            var c = $('#joe_political_map .canv_ww')[0].getContext('2d');
            c.strokeStyle = 'rgb(0,100,0)';
            var wonders = {},
                wonderImages = {};
            for (var wonderType in wonder.map) {
                if (wonder.map.hasOwnProperty(wonderType)) {
                    var tmp = 0;
                    for (var wonderCoords in wonder.map[wonderType]) {
                        if (parseInt(wonder.map[wonderType][wonderCoords], 10) > tmp) {
                            wonders[wonderType] = wonderCoords;
                            tmp = parseInt(wonder.map[wonderType][wonderCoords], 10)
                        }
                    }
                }
            }
            var legend = $('#joe_political_map .legend .content');
            legend.append("<div class=\"item no_results\"></div>");
            for (var w in wonders) {
                if (wonders.hasOwnProperty(w)) {
                    var _w = w;
                    wonderImages[_w] = new Image();
                    wonderImages[_w].onload = function() {
                        c.drawImage(this, this.pos.split("_")[0] * _zoom - 9, this.pos.split("_")[1] * _zoom - 9);
                    };
                    wonderImages[_w].pos = wonders[_w];
                    wonderImages[_w].src = "https://felix.de/images/icons/ww/" + _w + ".png";
                    var wonder_string = _w.split("_of")[0].split("_");
                    wonder_string = wonder_string[wonder_string.length - 1];
                    wonder_string = wonder_string.substring(0, 1).toUpperCase() + wonder_string.substring(1);
                    legend.append("<img class='wonder_icon' src='" + wonderImages[_w].src + "'><div class='item'>" + wonder_string + "</div>");
                }
            }
        },
        clearMap: function() {
            $('#joe_political_map .canv_map').remove();
            $('#joe_political_map .canv_ww').remove();
        },
        getAllianceColors: function() {
            $.ajax({
                type: "GET",
                url: "https://" + Game.world_id + ".grepolis.com/game/map_data?town_id=" + Game.townId + "&action=get_custom_colors&h=" + Game.csrfToken,
                dataType: 'json',
                success: function(response) {
                    var html_string = $('#alliance_box', $(response.json.list_html));
                    var flagArray = $('.flag', html_string);
                    var linkArray = $('a', html_string);
                    var allianceColorArray = [];
                    for (var i = 0; i < flagArray.length; i++) {
                        allianceColorArray[i] = {
                            "id": parseInt(linkArray[i].attributes.onclick.value.split(",")[1].split(")")[0], 10),
                            "color": flagArray[i].style.backgroundColor
                        };
                    }
                }
            });
        }
    };
    var ColorPicker = {
        open: function(pos_left, pos_top) {
            $('#joe_color_picker').removeClass("hidden");
            $('#joe_color_picker').css({
                left: pos_left,
                top: pos_top
            });
        },
        close: function() {
            $('#joe_color_picker').addClass("hidden");
        },
        init: function() {
            $('<style id="joe_color_picker_style">' +
                '#joe_color_picker { left:200px;top:300px;position:absolute;z-index:1000;} ' +
                '#joe_color_picker.hidden { display:none;} ' +
                '#joe_color_picker span.grepo_input, ' +
                '#joe_color_picker a.color_table, ' +
                '#joe_color_picker a.confirm, ' +
                '#joe_color_picker a.cancel' +
                ' { float:left; } ' +
                '</style>').appendTo('head');
            $(
                '<canvas width="600" height="440" style="left:200px !important;top:100px !important;" id="canvas_picker" onclick="console.debug(this.getContext(\'2d\').getImageData(10, 10, 1, 1).data)"></canvas>' +
                '<div id="hex">HEX: <input type="text"></input></div>' +
                '<div id="rgb">RGB: <input type="text"></input></div>'
            ).prependTo('#joe_political_map')
            $(
                '<div id="joe_color_picker" class="hidden"><table class="bb_popup" cellpadding="0" cellspacing="0"><tbody>' +
                '<tr class="bb_popup_top">' +
                '<td class="bb_popup_top_left"></td>' +
                '<td class="bb_popup_top_middle"></td>' +
                '<td class="bb_popup_top_right"></td>' +
                '</tr>' +
                '<tr>' +
                '<td class="bb_popup_middle_left"></td>' +
                '<td class="bb_popup_middle_middle">' +
                '<div class="bb_color_picker_colors">' +
                '<div style="background-color: rgb(255, 0, 0);"></div>' +
                '<div style="background-color: rgb(0, 255, 0);"></div>' +
                '<div style="background-color: rgb(0, 0, 255);"></div>' +
                '</div>' +
                '<a href="#" class="cancel"></a>' +
                '<span class="grepo_input">' +
                '<span class="left">' +
                '<span class="right">' +
                '<input class="color_string" style="width:50px;" maxlength="6" type="text">' +
                '</span>' +
                '</span>' +
                '</span>' +
                '<a href="#" class="color_table"><input type="color" id="c" tabindex=-1 class="hidden"></a>' +
                '<a href="#" class="confirm"></a>' +
                '</td>' +
                '<td class="bb_popup_middle_right"></td>' +
                '</tr>' +
                '<tr class="bb_popup_bottom">' +
                '<td class="bb_popup_bottom_left"></td>' +
                '<td class="bb_popup_bottom_middle"></td>' +
                '<td class="bb_popup_bottom_right"></td>' +
                '</tr>' +
                '</tbody></table></div>'
            ).prependTo('#joe_political_map');
            var canvas = document.getElementById('canvas_picker').getContext('2d');
            var count = 5,
                line = 0,
                width = 16,
                height = 12,
                sep = 1;
            var offset = (count - 2) * width;
            for (var i = 2, j = 0; i < count; i++, j++) {
                line = 0;
                canvas.fillStyle = "rgb(" + ((i / count * 255) | 0) + ", 0, " + ((i / count * 255) | 0) + ")";
                canvas.fillRect(i * width, line, width - sep, height - sep);
                canvas.fillStyle = "rgb(255," + ((j / (count - 1) * 255) | 0) + ", 255)";
                canvas.fillRect(i * width + offset, line, width - sep, height - sep);
                line = line + height;
                canvas.fillStyle = "rgb(" + ((i / count * 255) | 0) + ", 0, " + ((i / count * 127) | 0) + ")";
                canvas.fillRect(i * width, line, width - sep, height - sep);
                canvas.fillStyle = "rgb(255," + ((j / (count - 1) * 255) | 0) + "," + (127 + ((j / (count - 1) * 127) | 0)) + ")";
                canvas.fillRect(i * width + offset, line, width - sep, height - sep);
                line = line + height;
                canvas.fillStyle = "rgb(" + ((i / count * 255) | 0) + ", 0, 0)";
                canvas.fillRect(i * width, line, width - sep, height - sep);
                canvas.fillStyle = "rgb(255," + ((j / (count - 1) * 255) | 0) + "," + ((j / (count - 1) * 255) | 0) + ")";
                canvas.fillRect(i * width + offset, line, width - sep, height - sep);
                line = line + height;
                canvas.fillStyle = "rgb(" + ((i / count * 255) | 0) + ", " + ((i / count * 127) | 0) + ", 0)";
                canvas.fillRect(i * width, line, width - sep, height - sep);
                canvas.fillStyle = "rgb(255, " + (127 + ((j / (count - 1) * 127) | 0)) + "," + ((j / (count - 1) * 255) | 0) + ")";
                canvas.fillRect(i * width + offset, line, width - sep, height - sep);
                line = line + height;
                canvas.fillStyle = "rgb(" + ((i / count * 170) | 0) + ", " + ((i / count * 85) | 0) + ", 0)";
                canvas.fillRect(i * width, line, width - sep, height - sep);
                canvas.fillStyle = "rgb(" + (170 + (j / (count - 1) * 85) | 0) + ", " + (85 + ((j / (count - 1) * 170) | 0)) + "," + ((j / (count - 1) * 255) | 0) + ")";
                canvas.fillRect(i * width + offset, line, width - sep, height - sep);
                line = line + height;
                canvas.fillStyle = "rgb(" + ((i / count * 191) | 0) + ", " + ((i / count * 127) | 0) + ", 0)";
                canvas.fillRect(i * width, line, width - sep, height - sep);
                canvas.fillStyle = "rgb(" + (191 + (j / (count - 1) * 64) | 0) + ", " + (127 + ((j / (count - 1) * 127) | 0)) + "," + ((j / (count - 1) * 255) | 0) + ")";
                canvas.fillRect(i * width + offset, line, width - sep, height - sep);
                line = line + height;
                canvas.fillStyle = "rgb(" + ((i / count * 255) | 0) + ", " + ((i / count * 255) | 0) + ", 0)";
                canvas.fillRect(i * width, line, width - sep, height - sep);
                canvas.fillStyle = "rgb(255, 255," + ((j / (count - 1) * 255) | 0) + ")";
                canvas.fillRect(i * width + offset, line, width - sep, height - sep);
                line = line + height;
                canvas.fillStyle = "rgb(" + ((i / count * 127) | 0) + "," + ((i / count * 191) | 0) + ", 0)";
                canvas.fillRect(i * width, line, width - sep, height - sep);
                canvas.fillStyle = "rgb(" + (127 + (j / (count - 1) * 127) | 0) + "," + (191 + (j / (count - 1) * 64) | 0) + "," + ((j / (count - 1) * 255) | 0) + ")";
                canvas.fillRect(i * width + offset, line, width - sep, height - sep);
                line = line + height;
                canvas.fillStyle = "rgb(0," + ((i / count * 255) | 0) + ", 0)";
                canvas.fillRect(i * width, line, width - sep, height - sep);
                canvas.fillStyle = "rgb(" + ((j / (count - 1) * 255) | 0) + ", 255," + ((j / (count - 1) * 255) | 0) + ")";
                canvas.fillRect(i * width + offset, line, width - sep, height - sep);
                line = line + height;
                canvas.fillStyle = "rgb(0, " + ((i / count * 191) | 0) + "," + ((i / count * 127) | 0) + ")";
                canvas.fillRect(i * width, line, width - sep, height - sep);
                canvas.fillStyle = "rgb(" + ((j / (count - 1) * 255) | 0) + "," + (191 + (j / (count - 1) * 64) | 0) + ", " + (127 + ((j / (count - 1) * 127) | 0)) + ")";
                canvas.fillRect(i * width + offset, line, width - sep, height - sep);
                line = line + height;
                canvas.fillStyle = "rgb(0, " + ((i / count * 255) | 0) + ", " + ((i / count * 255) | 0) + ")";
                canvas.fillRect(i * width, line, width - sep, height - sep);
                canvas.fillStyle = "rgb(" + ((j / (count - 1) * 255) | 0) + ",255, 255)";
                canvas.fillRect(i * width + offset, line, width - sep, height - sep);
                line = line + height;
                canvas.fillStyle = "rgb(0, " + ((i / count * 127) | 0) + "," + ((i / count * 255) | 0) + ")";
                canvas.fillRect(i * width, line, width - sep, height - sep);
                canvas.fillStyle = "rgb(" + ((j / (count - 1) * 255) | 0) + "," + (127 + ((j / (count - 1) * 127) | 0)) + ", 255)";
                canvas.fillRect(i * width + offset, line, width - sep, height - sep);
                line = line + height;
                canvas.fillStyle = "rgb(0, 0, " + ((i / count * 255) | 0) + ")";
                canvas.fillRect(i * width, line, width - sep, height - sep);
                canvas.fillStyle = "rgb(" + ((j / (count - 1) * 255) | 0) + "," + ((j / (count - 1) * 255) | 0) + ", 255)";
                canvas.fillRect(i * width + offset, line, width - sep, height - sep);
                line = line + height;
                canvas.fillStyle = "rgb(" + ((i / count * 127) | 0) + ", 0, " + ((i / count * 255) | 0) + ")";
                canvas.fillRect(i * width, line, width - sep, height - sep);
                canvas.fillStyle = "rgb(" + (127 + ((j / (count - 1) * 127) | 0)) + "," + ((j / (count - 1) * 255) | 0) + ", 255)";
                canvas.fillRect(i * width + offset, line, width - sep, height - sep);
                line = line + height;
            }
            line = line + height;
            for (var i = 0; i <= count; i++) {
                canvas.fillStyle = "rgb(" + ((i / count * 255) | 0) + ", " + ((i / count * 255) | 0) + ", " + ((i / count * 255) | 0) + ")";
                canvas.fillRect(i * width + width * 2, line, width - sep, height - sep);
            }
            function rgbToHex(R, G, B) {
                return toHex(R) + toHex(G) + toHex(B)
            }
            function toHex(n) {
                n = parseInt(n, 10);
                if (isNaN(n)) return "00";
                n = Math.max(0, Math.min(n, 255));
                return "0123456789ABCDEF".charAt((n - n % 16) / 16) + "0123456789ABCDEF".charAt(n % 16);
            }
            $('#joe_color_picker a.cancel').click(function() {
                ColorPicker.close();
            });
            $('#joe_color_picker a.confirm').click(function() {
                $(ColorPicker).trigger("onColorChanged", [$('#joe_color_picker .color_string')[0].value]);
                ColorPicker.close();
            });
            $('#joe_color_picker a.color_table').click(function() {
                document.getElementById("c").click();
            });
            $('#joe_color_picker a.color_table #c').change(function() {
                $('#joe_color_picker input.color_string')[0].value = this.value;
                $('#joe_color_picker input.color_string')[0].style.color = this.value;
            });
        }
    };
    var UnitImages = {
        activate: function() {
            $('<style id="joe_unit_images">' +
                '.unit_icon25x25 { background-image: url(https://i.imgur.com/wsmJMqz.png);} ' +
                '.unit_icon40x40 { background-image: url(https://felix.de/images/game/units/unit_icons_40x40_2.91.png);} ' +
                '.unit_icon50x50 { background-image: url(https://felix.de/images/game/units/unit_icons_50x50_2.91.png);} ' +
                '.unit_icon90x90 { background-image: url(https://felix.de/images/game/units/unit_icons_90x90_2.91.png);} ' +
                '.unit_icon228x165 { background-image: none; height:0px;} ' +
                '.unit_card .deco_statue { background-image: none !important;} ' +
                '.grepo_box_silver .border_l, .grepo_box_silver .border_r { background-image: none;} ' +
                '.box_corner .box_corner_tl, .grepo_box_silver .box_corner_tr { height:31px; } ' +
                '.grepo_box_silver .grepo_box_content { padding: 21px 10px 0px; } ' +
                '</style>').appendTo('head');
        },
        deactivate: function() {
            $('#joe_unit_images').remove();

        }
    };
    ///////////////////////////////////
   //         * Grepodata *         //
  ///////////////////////////////////
    var Statistics = {
        activate: function() {
            Statistics.addButton();
            $('<style id="flask_statistic_style">' +
                '#flask_statistic_button { top:50px; right:113px; z-index:10; position:absolute; } ' +
                '#flask_statistic_button .ico_statistics { margin:8px 0px 0px 7px; width:18px; height:18px; background:url(https://i.ibb.co/pZC6X6M/pngegg-12.png) no-repeat 0px 0px; background-size:100%; } ' +
                '#flask_statistic_button .ico_statistics.checked { margin-top:8px; } ' +
                '</style>').appendTo('head');
        },
        deactivate: function() {
            $('#flask_statistic_button').remove();
            $('#flask_statistic_style').remove();
        },
        addButton: function() {
            $('<div id="flask_statistic_button" class="circle_button"><div class="ico_statistics js-caption"></div></div>').appendTo(".gods_area");
            $('#flask_statistic_button').on('mousedown', function() {
                $('#flask_statistic_button, .ico_statistics').addClass("checked");
            }).on('mouseup', function() {
                $('#flask_statistic_button, .ico_statistics').removeClass("checked");
            });
            $('#flask_statistic_button').click(function() {
                window.open("http://grepodata.com/points/" + WID);
                $('#flask_statistic_button, .ico_statistics').addClass("checked");
            });
            $('#flask_statistic_button').tooltip(getText("labels", "stt"));
        },
    };
    ///////////////////////////////////
   //  * town Trade Improvement *   //
  ///////////////////////////////////
    var townTradeImprovement = {
        activate: function() {},
        add: function() {
            var wnd = GPWindowMgr.getFocusedWindow() || false;
            var joe_wnd = wnd.getJQElement().find(".gpwindow_content");
            var joe_wndid = wnd.getID();
            if (joe_wnd.find(".joe_needed").length > 0 || joe_wnd.find(".town-capacity-indicator").length == 0)
                return;
            $('.q_send_cult_reverse').remove();
            function getRes(res_type, wnd_id, mode) {
                var res = {};
                res.wnd = $("DIV#gpwnd_" + wnd_id);
                res.selector = res.wnd.find("#town_capacity_" + res_type);
                res.caption = {
                    curr: parseInt(res.wnd.find("#big_progressbar .caption .curr").html()),
                    max: parseInt(res.wnd.find("#big_progressbar .caption .max").html()),
                    now: parseInt(res.wnd.find("#trade_type_" + res_type + " input").val())
                }
                res.amounts = {
                    curr: parseInt(res.selector.find(".curr").html()) || 0,
                    curr2: parseInt(res.selector.find(".curr2").html().substring(3)) || 0,
                    curr3: parseInt(res.selector.find(".curr3").html().substring(3)) || 0,
                    max: parseInt(res.selector.find(".max").html()) || 0
                }
                if (mode === "cult" || mode === "cultreverse") {
                    res.amounts.max = (res_type === "stone") ? 18000 : 15000;
                }
                if (mode === "cultreverse") {
                    var townrescurrent = $("div#ui_box div.ui_resources_bar div.indicator[data-type='" + res_type + "'] div.amount").text();
                    res.needed = townrescurrent - res.amounts.max;
                } else {
                    res.needed = res.amounts.max - res.amounts.curr - res.amounts.curr2;
                }
                return res;
            }
            joe_wnd.find(".tripple-progress-progressbar").each(function() {
                var res_type = this.id.split("_")[2];
                var res = getRes(res_type, joe_wndid);
                $(this).find(".amounts").append('<span class="joe_needed_' + res_type + '_' + joe_wndid + '"> &#9658; ' + res.needed + '</span>');
            });
            joe_wnd.find("#trade_tab").append(
                '<div id="joe_Improvement_trade">' +
                '<a id="joe_wood_' + joe_wndid + '_max" class="joe_trade joe_max" style="top:200px"></a>' +
                '<a id="joe_stone_' + joe_wndid + '_max" class="joe_trade joe_max" style="top:234px"></a>' +
                '<a id="joe_iron_' + joe_wndid + '_max" class="joe_trade joe_max" style="top:268px"></a>' +
                '<a id="joe_wood_' + joe_wndid + '_cult" class="joe_trade joe_send_cult" style="top:200px"></a>' +
                '<a id="joe_stone_' + joe_wndid + '_cult" class="joe_trade joe_send_cult" style="top:234px"></a>' +
                '<a id="joe_iron_' + joe_wndid + '_cult" class="joe_trade joe_send_cult" style="top:268px"></a>' +
                '</div>'
            );
            joe_wnd.find(".joe_send_cult").css({
                "right": "84px",
                "position": "absolute",
                "height": "16px",
                "width": "22px",
                "title": "teste",
                "background-image": "url(https://i.imgur.com/FNbAu5D.png)",
                "background-repeat": "no-repeat",
                "background-position": "0px -1px"
            });
            joe_wnd.find(".joe_send_cult_reverse").css({
                "left": "105px",
                "position": "absolute",
                "height": "16px",
                "width": "22px",
                "background-image": "url(https://i.imgur.com/yqDSJNJ.png)",
                "background-repeat": "no-repeat",
                "background-position": "0px -1px"
            });
            joe_wnd.find(".joe_max").css({
                "right": "105px",
                "position": "absolute",
                "height": "16px",
                "width": "22px",
                "background-image": "url(https://i.imgur.com/7dJtEZI.png)",
                "background-repeat": "no-repeat",
                "background-position": "0px -1px"
            });
            joe_wnd.find(".joe_trade").hover(
                function() {
                    $(this).css({
                        "background-position": "0px -17px"
                    });
                },
                function() {
                    $(this).css({
                        "background-position": "0px -1px"
                    });
                });
            joe_wnd.find(".joe_trade").click(function() {
                var id = this.id.split("_");
                var res = getRes(id[1], id[2], id[3]);
                if (res.needed - res.amounts.curr3 <= 0 || res.caption.curr <= 0 || res.amounts.curr3 > 0) {
                    res.send = 0;
                } else if (res.needed - res.amounts.curr3 > res.caption.curr) {
                    res.send = res.caption.curr + res.amounts.curr3
                } else {
                    res.send = res.needed;
                }
                res.wnd.find("#trade_type_" + id[1] + " input").val(res.send).select().blur();
            });
            $('.joe_max').tooltip(joe_icon + "max");
            $('.joe_send_cult').tooltip(joe_icon + getText("labels", "cityfestivals"));
        },
        deactivate: function() {
            $('#joe_Improvement_trade').remove();
        },
    };
    ///////////////////////////////////
   //      * Holiday Special *      //
  ///////////////////////////////////
    var HolidaySpecial = {
        isHalloween: false,
        isXmas: false,
        isNewYear: false,
        isEaster: false,
        activate: function() {
            var daystamp = 1000 * 60 * 60 * 24,
                today = new Date((new Date()) % (daystamp * (365 + 1 / 4))), // without year
                halloween_start = daystamp * 297,
                halloween_end = daystamp * 321,
                xmas_start = daystamp * 334,
                xmas_end = daystamp * 361,
                newYear_start = daystamp * 0,
                newYear_end = daystamp * 7;
            HolidaySpecial.isHalloween = (today >= halloween_start) ? (today <= halloween_end) : false;
            HolidaySpecial.isXmas = (today >= xmas_start) ? (today <= xmas_end) : false;
            HolidaySpecial.isNewYear = (today >= newYear_start) ? (today <= newYear_end) : false;
            if (HolidaySpecial.isXmas) {
                HolidaySpecial.XMas.add();
            }
            if (HolidaySpecial.isNewYear) {
                HolidaySpecial.NewYear.add();
            }
            var X = 2016;
            var K = parseInt(X / 100, 10);
            var A = X % 19;
            var M = 15 + parseInt((3 * K + 3) / 4, 10) - parseInt((8 * K + 13) / 25, 10);
            var S = 2 - parseInt((3 * K + 3) / 4, 10);
            var D = (19 * A + M) % 30;
            var R = parseInt((D + parseInt(A / 11, 10)) / 29, 10);
            var OG = 21 + D - R;
            var SZ = 7 - ((2016 + parseInt(2016 / 4, 10) + S) % 7);
            var OE = 7 - ((OG - SZ) % 7);
            var OS = OG + OE;
        },
        XMas: {
            add: function() {
                $('<a href="http://www.greensmilies.com/smilie-album/weihnachten-smilies/" target="_blank"><div id="joe_xmas"></div></a>').appendTo('#ui_box');
                var joeXMAS = $('#joe_xmas');
                joeXMAS.css({
                    background: 'url("https://i.imgur.com/nowzVtE.gif") no-repeat',
                    height: '51px',
                    width: '61px',
                    position: 'absolute',
                    bottom: '10px',
                    left: '60px',
                    zIndex: '2000'
                });
                joeXMAS.tooltip("Merry Christmas!");
            }
        },
        NewYear: {
            add: function() {
                $('<a href="http://www.greensmilies.com/smilie-album/" target="_blank"><div id="joe_newYear">' +
                    '<img src="https://i.imgur.com/DWMmjF7.gif">' + //(2) ano 2021
                    '<img src="https://i.imgur.com/E7spHRq.gif">' + //(0)
                    '<img src="https://i.imgur.com/DWMmjF7.gif">' + //(2)
                    '<img src="https://i.imgur.com/XXtaiAg.gif">' + //(1)
                    '</div></a>').appendTo('#ui_box');
                var joeNewYear = $('#joe_newYear');
                joeNewYear.css({
                    position: 'absolute',
                    bottom: '10px',
                    left: '70px',
                    zIndex: '10'
                });
                joeNewYear.tooltip("Happy new year!");
            }
        }
    };
}
    ///////////////////////////////////
   //      * Hour Calculator *      //
  ///////////////////////////////////
var w = window,
    $ = w.$;
new function() {
    Function.prototype.curry = function() {
        if (arguments.length < 1)
            return this;
        var Funktion = this;
        var Argumente = Array.prototype.slice.call(arguments);
        return function() {
            return Funktion.apply(this, Argumente.concat(Array.prototype.slice.call(arguments)));
        };
    };
}();
function Analysieren(Objekt, Text, Erbe, auch_versteckte, kein_alert, kein_log, Stapel_ausgeben) {
    if (typeof Text != "string")
        Text = "<unbekannt>";
    Text = "Analysiere " + Text + " (Typ: ";
    var Typ;
    Text += Typ = typeof Objekt;
    Text += ")\n";
    if (Typ == "string" || Typ == "number" || Typ == "boolean" || Typ == "date")
        Text += "Wert: " + Objekt + "\n";
    else if (Typ == "function")
        Text += "Definition:\n" + Objekt.toString() + "\n";
    var str = "";
    var str2;
    var Elemente;
    if (auch_versteckte) {
        Elemente = {};
        var Namen = Object.getOwnPropertyNames(Objekt);
        for (var i = 0; i < Namen.length; ++i)
            Elemente[Namen[i]] = Objekt[Namen[i]];
    } else
        Elemente = Objekt;
    for (var E in Elemente) {
        if (Erbe || typeof Objekt.hasOwnProperty != "function" || Objekt.hasOwnProperty(E)) {
            str2 = "";
            if (typeof Objekt[E] == "string")
                str2 = ": \"" + Objekt[E] + "\"";
            else if (typeof Objekt[E] == "number" || typeof Objekt[E] == "boolean" || Typ == "date")
                str2 = ": " + Objekt[E];
            str += "  - " + E + " (" + typeof Objekt[E] + ")" + str2 + "\n";
        }
    }
    Text += str;
    if (Stapel_ausgeben) {
        str = "\naktueller Stapel:\n";
        var aktuell = Analysieren;
        while (aktuell.caller) {
            str += "  - " + aktuell.name + " (Argumente: " + aktuell.arguments.length + ")\n";
            aktuell = aktuell.caller;
        }
        Text += str += "  - " + aktuell.name + " (Argumente: " + aktuell.arguments.length + ")\n\n";
    }
    if (!kein_log)
        console.log(Text);
    if (!kein_alert)
        alert(Text);
    return Text;
}
function Fehler_analysieren(Fehler, Text) {
    if (typeof Text != "string")
        Text = "";
    Analysieren(Fehler, Text + " - " + Fehler.name + " - " + Fehler.message, true);
}
function Fehlerblock(This, Funktion, Argumente) {
    var Ergebnis;
    try {
        Ergebnis = Funktion.apply(This, Argumente);
    } catch (ex) {
        Fehler_analysieren(ex);
    }
    return Ergebnis;
}
function Fehlerfunktion(Funktion, This) {
    return function() {
        Fehlerblock(This || this, Funktion, arguments);
    };
}
function formatieren(Text) {
    Text = Text.split("%%");
    for (var E in Text) {
        var i = arguments.length;
        while (i--)
            Text[E] = Text[E].replace("%" + i + "%", arguments[i]).replace("%" + i, arguments[i]);
    }
    return Text.join("%");
}
function formatieren2(Text, Ersetzungen) {
    Text = Text.split("%%");
    for (var E in Text) {
        var i = arguments.length;
        for (var Ziel in Ersetzungen)
            Text[E] = Text[E].replace("%" + Ziel + "%", Ersetzungen[Ziel]).replace("%" + Ziel, Ersetzungen[Ziel]);
    }
    return Text.join("%");
}
function Button_erstellen(Text) {
    return $('<a href="#" class="button"><span class="left"><span class="right"><span class="middle"><small>' + Text + "</small></span></span></span></a>");
}
function Link_erstellen(Text) {
    return $('<a href="#">' + Text + "</a>");
}
function kleinen_Link_erstellen(Text) {
    return $('<a href="#"><small>' + Text + "</small></a>");
}
function hellen_Link_erstellen(Text) {
    return $('<a href="#" class="Link_hell">' + Text + "</a>");
}
function hellen_kleinen_Link_erstellen(Text) {
    return $('<a href="#" class="Link_hell"><small>' + Text + "</small></a>");
}
var JoeManCalculator = w.JoeManCalculator = {
    Starten: Fehlerfunktion(function() {
        JoeManCalculator.Beenden();
        if (!JoeManCalculator.Stilelement)
            JoeManCalculator.Stilelement = $('<style type="text/css">a.Link_hell:not(:hover):not(:active){color:rgb(255,204,102)}</style>').appendTo(document.head);
        JoeManCalculator.Container = $('<div class="sidebar_unit_wrapper" style="display: none;"></div>').insertAfter(".bottom_ornament");
        JoeManCalculator.Button = Button_erstellen("Calculator").css({
            margin: "0px",
            padding: "0px 1px",
            display: "block"
        }).click(JoeManCalculator.anzeigen).insertAfter(".bottom_ornament");
        JoeManCalculator.Element = $('<div class="sidebar_unit_container clearfix" style="color: #FFCC66; font-size: x-small; margin-bottom: 6px; padding-bottom: 6px; margin-left: 1px; background-position: right; background-image: url(https://i.imgur.com/7Lpu0ja.png);"></div>').appendTo(JoeManCalculator.Container);
        $(".bottom_ornament").css("bottom", "-27px");
        $(".bottom_ornament").css("height", "31px");
    }),
    Beenden: function() {
        if (JoeManCalculator.Eingabe1_Stunden) {
            JoeManCalculator.Eingabe1_Stunden.remove();
            delete JoeManCalculator.Eingabe1_Stunden;
        }
        if (JoeManCalculator.Eingabe1_Minuten) {
            JoeManCalculator.Eingabe1_Minuten.remove();
            delete JoeManCalculator.Eingabe1_Minuten;
        }
        if (JoeManCalculator.Eingabe1_Sekunden) {
            JoeManCalculator.Eingabe1_Sekunden.remove();
            delete JoeManCalculator.Eingabe1_Sekunden;
        }
        if (JoeManCalculator.Eingabe1) {
            JoeManCalculator.Eingabe1.remove();
            delete JoeManCalculator.Eingabe1;
        }
        if (JoeManCalculator.Eingabe2_Stunden) {
            JoeManCalculator.Eingabe2_Stunden.remove();
            delete JoeManCalculator.Eingabe2_Stunden;
        }
        if (JoeManCalculator.Eingabe2_Minuten) {
            JoeManCalculator.Eingabe2_Minuten.remove();
            delete JoeManCalculator.Eingabe2_Minuten;
        }
        if (JoeManCalculator.Eingabe2_Sekunden) {
            JoeManCalculator.Eingabe2_Sekunden.remove();
            delete JoeManCalculator.Eingabe2_Sekunden;
        }
        if (JoeManCalculator.Eingabe2) {
            JoeManCalculator.Eingabe2.remove();
            delete JoeManCalculator.Eingabe2;
        }
        if (JoeManCalculator.Button_Plus) {
            JoeManCalculator.Button_Plus.remove();
            delete JoeManCalculator.Button_Plus;
        }
        if (JoeManCalculator.Button_Minus) {
            JoeManCalculator.Button_Minus.remove();
            delete JoeManCalculator.Button_Minus;
        }
        if (JoeManCalculator.Ergebnis) {
            JoeManCalculator.Ergebnis.remove();
            delete JoeManCalculator.Ergebnis;
        }
        if (JoeManCalculator.Element) {
            JoeManCalculator.Element.remove();
            delete JoeManCalculator.Element;
        }
        if (JoeManCalculator.Container) {
            JoeManCalculator.Container.remove();
            delete JoeManCalculator.Container;
        }
        if (JoeManCalculator.Button) {
            JoeManCalculator.Button.remove();
            delete JoeManCalculator.Button;
        }
    },
    anzeigen: Fehlerfunktion(function() {
        if (!JoeManCalculator.Container)
            return;
        JoeManCalculator.Container.toggle();
        if (JoeManCalculator.Container.is(":visible")) {
            var Eingabe = Fehlerfunktion(function Eingabe(Nummer, Index, Ereignis) {
                var Ziel = Ereignis.target;
                if (Ziel.value[0] == ":")
                    Ziel.value = Ziel.value.substring(1);
                var Text = Ziel.value;
                var weiter = JoeManCalculator["Eingabe" + Nummer + "_" + (Index + 1)];
                var Cursor = Ziel.selectionStart == Ziel.selectionEnd ? Ziel.selectionStart : Ziel.selectionDirection == "forward" ? Ziel.selectionEnd : Ziel.selectionStart;
                if (Text.length == 1) {
                    Ziel.blur();
                    Ziel.focus();
                } else if (Text.length > 2 && weiter) {
                    Ziel.value = Text.substring(0, 2);
                    weiter.val(Text.substring(2));
                    if (Cursor > 2) {
                        weiter.get(0).selectionStart = weiter.get(0).selectionEnd = Cursor - 2;
                        weiter.focus();
                    }
                    Eingabe(Nummer, Index + 1, {
                        target: weiter.get(0)
                    });
                } else if (Cursor >= 2 && Ziel.selectionStart == Ziel.selectionEnd) {
                    if (weiter) {
                        weiter.get(0).selectionStart = Cursor - 2;
                        weiter.get(0).selectionEnd = weiter.val().length;
                        weiter.focus();
                    } else if (JoeManCalculator["Eingabe" + (Nummer + 1)]) {
                        weiter = JoeManCalculator["Eingabe" + (Nummer + 1) + "_1"];
                        weiter.get(0).selectionStart = 0;
                        weiter.get(0).selectionEnd = weiter.val().length;
                        weiter.focus();
                    } else {
                        JoeManCalculator.Eingabe1_1.get(0).selectionStart = 0;
                        JoeManCalculator.Eingabe1_1.get(0).selectionEnd = JoeManCalculator.Eingabe1_1.val().length;
                        JoeManCalculator.Eingabe1_1.focus();
                    }
                }
            });
            JoeManCalculator.Element.empty();
            JoeManCalculator.Eingabe1 = $('<span style="width: 114px; height: 12px; display: dock; margin-top: 2px;"></span>').appendTo(JoeManCalculator.Element);
            JoeManCalculator.Eingabe1_1 = $('<input type="text" value="00" style="background-color: #03035600; color: #EAF53F; width: 16px;" />').on("input", Eingabe.curry(1, 1)).appendTo(JoeManCalculator.Eingabe1);
            JoeManCalculator.Eingabe1.append(":");
            JoeManCalculator.Eingabe1_2 = $('<input type="text" value="00" style="background-color: #03035600; color: #EAF53F; width: 16px;" />').on("input", Eingabe.curry(1, 2)).appendTo(JoeManCalculator.Eingabe1);
            JoeManCalculator.Eingabe1.append(":");
            JoeManCalculator.Eingabe1_3 = $('<input type="text" value="00" style="background-color: #03035600; color: #EAF53F; width: 16px;" />').on("input", Eingabe.curry(1, 3)).appendTo(JoeManCalculator.Eingabe1);
            JoeManCalculator.Element.append("<br />");
            JoeManCalculator.Eingabe2 = $('<span style="width: 114px; height: 12px; display: dock; margin-top: 3px; margin-bottom: 3px;"></span>').appendTo(JoeManCalculator.Element);
            JoeManCalculator.Eingabe2_1 = $('<input type="text" value="00" style="background-color: #03035600; color: #EAF53F; width: 16px;" />').on("input", Eingabe.curry(2, 1)).appendTo(JoeManCalculator.Eingabe2);
            JoeManCalculator.Eingabe2.append(":");
            JoeManCalculator.Eingabe2_2 = $('<input type="text" value="00" style="background-color: #03035600; color: #EAF53F; width: 16px;" />').on("input", Eingabe.curry(2, 2)).appendTo(JoeManCalculator.Eingabe2);
            JoeManCalculator.Eingabe2.append(":");
            JoeManCalculator.Eingabe2_3 = $('<input type="text" value="00" style="background-color: #03035600; color: #EAF53F; width: 16px;" />').on("input", Eingabe.curry(2, 3)).appendTo(JoeManCalculator.Eingabe2);
            JoeManCalculator.Plus_Button = Button_erstellen("Add (+)").click(Fehlerfunktion(function() {
                JoeManCalculator.Ergebnis_berechnen(function(a, b) {
                    return a + b;
                });
            })).appendTo(JoeManCalculator.Element);
            JoeManCalculator.Element.append("<br />");
            JoeManCalculator.Minus_Button = Button_erstellen("Less (-)").click(Fehlerfunktion(function() {
                JoeManCalculator.Ergebnis_berechnen(function(a, b) {
                    return a - b;
                });
            })).appendTo(JoeManCalculator.Element);
            JoeManCalculator.Element.append("<br />");
            JoeManCalculator.Ergebnis = $('<b style="margin-left: auto; margin-right: auto; color: #fc6; font-size: 10px; ">JoeMan</b>').appendTo(JoeManCalculator.Element);
        }
    }),
    Ergebnis_berechnen: function(Funktion) {
        if (JoeManCalculator.Eingabe1 && JoeManCalculator.Eingabe2 && JoeManCalculator.Ergebnis) {
            try {
                JoeManCalculator.Ergebnis.html(JoeManCalculator.als_Zeit(Funktion(JoeManCalculator.Eingabe(1), JoeManCalculator.Eingabe(2))));
            } catch (Fehler) {
                JoeManCalculator.Ergebnis.html('<span style="color: red;">' + Fehler.message + "</span>");
            }
        }
    },
    Eingabe: function(Nummer) {
        var Eingabe = JoeManCalculator["Eingabe" + Nummer];
        Eingabe = Eingabe.find("input");
        if (Eingabe) {
            var Ergebnis = 0;
            Eingabe.each(function() {
                Ergebnis *= 60;
                Ergebnis += parseInt(this.value);
            });
            return Ergebnis;
        }
    },
    als_Zeit: function(Sekunden) {
        var minus = Sekunden < 0;
        if (minus)
            Sekunden = -Sekunden;
        var Minuten = Sekunden / 60 >> 0;
        Sekunden %= 60;
        var Stunden = Minuten / 60 >> 0;
        Minuten %= 60;
        var Tage = Stunden / 24 >> 0;
        Stunden %= 24;
        if (Sekunden < 10)
            Sekunden = "0" + Sekunden;
        if (Minuten < 10)
            Minuten = "0" + Minuten;
        if (Stunden < 10)
            Stunden = "0" + Stunden;
        return (minus ? "- (" : "") + Tage + " Day" + (Tage == 1 || Tage == -1 ? "" : "(s)") + " + " + Stunden + ":" + Minuten + ":" + Sekunden + (minus ? ")" : "");
    }
};
JoeManCalculator.Starten();
