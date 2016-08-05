define(function(require) {

  var Change = Backbone.Model.extend({
    /*
      normally contains props:
      {
        id: 'opaque base64 Google Urlsafe Key',
        for_date: '2016-05-05',
        for_class: '9.c',
        lessons: (int),
        lesson_0, lesson_1, lesson_..., lesson_(lessons - 1): (str)
      }
    */

    urlRoot: '/api/v1/changes',

    defaults: (function() {
      var defaults = {
        for_date: (new Date()).toISOString().substr(0,10),
        lessons: 5
      };

      _.times(defaults.lessons, function(lesson) {
        defaults['lesson_' + lesson] = null;
      });

      return defaults;
    })(),

    initialize: function() {
      if (_.isArray(this.get('lessons'))) {
        var lessons = this.get('lessons');
        var attrs = {
          lessons: lessons.length
        }
        _.forEach(lessons, function(lesson, i) {
          attrs['lesson_' + i] = lesson;
        });
        this.set(attrs);
      }
    },

    toJSON: function(options) {
      var useKeys = _(this.attributes)
        .keys()
        .reject(function(key) { return _.startsWith(key, 'lesson'); })
        .value();
      var repr = _.pick(this.attributes, useKeys);
      repr.lessons = [ ];
      _.times(this.attributes.lessons, function(lesson) {
        repr.lessons.push(this.attributes['lesson_' + lesson]);
      }.bind(this));

      return repr;
    },

    validate: function(attrs, options) {
      if (attrs.for_class.trim() === '') {
        return 'Lūdzu ievadiet klasi.';
      }

      if (isNaN(Date.parse(attrs.for_date))) {
        return 'Datums bija ievadīts nepareizi. ' +
          'Datumam būtu jāseko formātam GGGG-MM-DD.';
      }
    }
  });

  return Change;

});