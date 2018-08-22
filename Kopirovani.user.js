// ==UserScript==
// @name         Kopirovani
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Kopirovani!
// @author       You
// @match        https://www.zivefirmy.cz/*
// @grant        none
// ==/UserScript==

function wrap(text) {
    return "\"" + text + "\"";
}

function addOverviewItem(overviewUl, itemName, item) {
    overviewUl.append('<tr><td style="font-weight:bold;">'+itemName + ':</td><td>' + item +'</td></tr>');
}

function createDropDown(name, items, selectedIndex) {
    var dropDown = '<select name="'+name+'">"';
    for(var i = 0; i < items.length; i++) {
        var selected = i == selectedIndex ? 'selected' : '';
        dropDown += '<option value="'+items[i]+'" '+selected+'>'+items[i]+'</option>';
    }
    dropDown += "</select>"
    return dropDown;
}

(function() {
    'use strict';

    if($('*[itemtype="http://schema.org/LocalBusiness"]').length == 0) {
       return;
    }

    var ulice = $('*[itemprop=streetAddress]').text();
    var outAddr = $('*[itemprop=address]').contents().filter(function() {
       return this.nodeType == 3;
    });
    var cast1 = outAddr.first().text().trim();
    var cast2 = outAddr.first().next().text().trim();
    var mesto = $('*[itemprop=addressLocality]').text();
    var psc = $('*[itemprop=postalCode]').text();
    var adresa = [ulice, cast1, cast2, psc].join(", ");

    var icoTxt = $('body').find("div:contains('IČ: ')").last().contents().first().text();
    var ico = icoTxt.replace("IČ: ", "");

    var firma = $('.header *[itemprop=name]').first().text();
    var kontaktniOsoby = []
    $('*[itemprop=employees] *[itemprop=name]').each(function() {
        kontaktniOsoby.push($(this).text());
    });
    var tels = [];
    $('.spojeni *[itemprop=telephone]').each(function() {
        tels.push($(this).text());
    });
    var pocetZamestnancu = $('#pocet_zamestnancu').text().replace("Počet zaměstnanců: ", "");
    var empty = "";

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
    addOverviewItem(overviewUl, "Kontaktní Osoba", createDropDown("osoba", kontaktniOsoby, 0));
    addOverviewItem(overviewUl, "Telefon", createDropDown("tel1", tels, 0));
    addOverviewItem(overviewUl, "Telefon2", createDropDown("tel2", tels, 1));
    addOverviewItem(overviewUl, "Město", mesto);
    addOverviewItem(overviewUl, "Počet zaměstnanců", pocetZamestnancu);
    addOverviewItem(overviewUl, "Adresa", adresa);

    function copyToClipboard() {
        var osoba = $("#temper_overview select[name=osoba]").val();
        var tel1 = $("#temper_overview select[name=tel1]").val();
        var tel2 = $("#temper_overview select[name=tel2]").val();

        var lineArray = [empty, ico, firma, osoba, tel1, tel2, mesto, empty, pocetZamestnancu, adresa, psc];

        for(var i = 0; i < lineArray.length; i++) {
            lineArray[i] = wrap(lineArray[i])
        }

        var line = lineArray.join(";");
        navigator.clipboard.writeText(line);
    };

    $("#temper_overview select").on("change", copyToClipboard);
    copyToClipboard();
})();

