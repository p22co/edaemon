/*jshint ignore:start */
'use strict';

var rewire = require('rewire');

describe('l10n', function() {
    var l10n;

    beforeAll(function() {
        l10n = rewire('../index');
    });

    it('should return month name in nominative when formatting without specifying form',
    function() {
        expect(l10n.formatMonth(1)).toEqual('janvāris');
        expect(l10n.formatMonth(7)).toEqual('jūlijs');
    });

    it('should return month name in specified form when asked to nicely', function() {
        expect(l10n.formatMonth(4, 'genitivs')).toEqual('aprīļa');
        expect(l10n.formatMonth(10, 'akuzativs')).toEqual('oktobri');
    });

    it('should return nothing when asked to format nonexisting month or to an undefined form',
    function() {
        expect(l10n.formatMonth(16)).not.toBeDefined();
        expect(l10n.formatMonth(4, 'deklinativs')).not.toBeDefined();
    });


    it('should format dates without a leading zero', function() {
        expect(l10n.formatDate('6-12-01')).toEqual('6.gada 1.decembris');
        expect(l10n.formatDate('2015-12-01')).toEqual('2015.gada 1.decembris');
        expect(l10n.formatDate('2015-12-11')).toEqual('2015.gada 11.decembris');
    })

    it('should format proper ISO8601-compliant dates to specified form', function() {
        expect(l10n.formatDate('2015-12-01', 'dativs')).toEqual('2015.gada 1.decembrim');
        expect(l10n.formatDate('2000-03-16', 'lokativs')).toEqual('2000.gada 16.martā');
    });

    it('should return "unknown date" when asked to format dates not complying to ISO8601, using the specified form',
    function() {
        expect(l10n.formatDate('03/04/2010')).toEqual('nezināms datums');
        expect(l10n.formatDate('2010.14.21', 'genitivs')).toEqual('nezināma datuma');
        expect(l10n.formatDate('garbageDate', 'akuzativs')).toEqual('nezināmu datumu');
    });

    it('should return nominative form dates when form is not specified', function() {
        expect(l10n.formatDate('2010-01-01')).toEqual('2010.gada 1.janvāris');
        expect(l10n.formatDate('2011-04-04')).toEqual('2011.gada 4.aprīlis');
    });

    it('should return "unknown date" in nominative when an undefined form is specified', function() {
        expect(l10n.formatDate('2015-12-01', 'deklinativs')).toEqual('nezināms datums');
    });

    it('should not accept invalid months, returning "unknown date" instead, in specified form', function() {
        expect(l10n.formatDate('2015-15-01')).toEqual('nezināms datums');
        expect(l10n.formatDate('2015-15-01', 'genitivs')).toEqual('nezināma datuma');
    });

    it('should return weekday in an adverb form when asked to format it without specifying a form', function() {
        expect(l10n.formatWeekday(1)).toEqual('pirmdien');
        expect(l10n.formatWeekday(3)).toEqual('trešdien');
    });

    it('should return weekday in an adverb form when asked to format it with an invalid form', function() {
        expect(l10n.formatWeekday(1, 'deklinativs')).toEqual('pirmdien');
        expect(l10n.formatWeekday(3, 'deklinativs')).toEqual('trešdien');
    });

    it('should treat the weekday as a noun when changing its case', function() {
        expect(l10n.formatWeekday(1, 'dativs')).toEqual('pirmdienai');
        expect(l10n.formatWeekday(4, 'genitivs')).toEqual('ceturtdienas');
    });
});