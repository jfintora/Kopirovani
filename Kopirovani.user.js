// ==UserScript==
// @name         Kopirovani
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Kopirovani!
// @author       You
// @match        https://www.zivefirmy.cz/*
// @grant        none
// @require      http://code.jquery.com/jquery.min.js
// ==/UserScript==

function wrap(text) {
    return "\"" + text + "\"";
}

function addOverviewItem(overviewUl, itemName, item) {
    overviewUl.append('<tr><td style="font-weight:bold;">'+itemName + ':</td><td>' + item +'</td></tr>');
}

(function() {
    'use strict';
    var ulice = $('*[itemprop=streetAddress]').text();
    var outAddr = $('*[itemprop=address]').contents().filter(function() {
       return this.nodeType == 3;
    });
    var cast = outAddr[0].nodeValue.trim();
    var psc = outAddr[1].nodeValue.trim();
    var mesto = $('*[itemprop=addressLocality]').text();
    var adresa = [ulice, cast, psc].join(", ");

    var icoTxt = $('body').find("div:contains('IČ: ')").last().contents().first().text();
    var ico = icoTxt.replace("IČ: ", "");

    var firma = $('.header *[itemprop=name]').first().text();
    var kontaktniOsoba = $('*[itemprop=employees] *[itemprop=name]').first().text();
    var tel = $('.spojeni *[itemprop=telephone]').first().text();
    var empty = "";

    var lineArray = [empty, ico, firma, kontaktniOsoba, tel, empty, mesto, empty, empty, empty, empty, empty, empty, adresa];

    for(var i = 0; i < lineArray.length; i++) {
        lineArray[i] = wrap(lineArray[i])
    }

    var line = lineArray.join(";");
    navigator.clipboard.writeText(line);

    $('body').append('<div id="temper_overview"><table><legend><strong>Zkopírováno</strong></legend></table></div>');
    var overview = $('#temper_overview');
    overview.css({
        position : "fixed",
        bottom: "5em",
        right:0,
        "background-color": "#6ae88a",
        padding: "1em"
    });
    var overviewUl = overview.find("table");
    addOverviewItem(overviewUl, "IČ", ico);
    addOverviewItem(overviewUl, "Název", firma);
    addOverviewItem(overviewUl, "Kontaktní Osoba", kontaktniOsoba);
    addOverviewItem(overviewUl, "Telefon", tel);
    addOverviewItem(overviewUl, "Město", mesto);
    addOverviewItem(overviewUl, "Adresa", adresa);

})();