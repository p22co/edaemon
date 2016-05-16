# coding: utf-8

import webapp2
import json
from google.appengine.datastore.datastore_query import Cursor
from google.appengine.api import users
from google.appengine.ext import ndb
from functools import partial

from ..handler import BaseHandler
from application.common.models import Change
from application.utility.dates import ISO8601
from application.utility.lesson import lesson_pipeline

class AllChanges(BaseHandler):
    @BaseHandler.collection_method('Change')
    def get(self):
        return Change.get_week(), [Change.for_class, Change.for_date]

    @BaseHandler.wrap_exception
    def post(self):
        if not users.get_current_user():
            self.fail(401, 'Authorization is required to access this resource.')
            return
        elif not users.is_current_user_admin():
            self.fail(403,
                'Administrative privileges are required to access this resource.')
            return

        data = json.loads(self.request.body)
        # data = { date: …, items: [ { className: …, lessons: [ … ] } ] }
        if not ISO8601.is_valid(data['date']):
            self.fail(400, 'Invalid date')
            return
        else:
            common_date = ISO8601.parse(data['date'])
        resp = dict()
        for change_item in data['items']:
            lessons = lesson_pipeline(change_item['lessons'])
            c = Change(for_class=change_item['className'], for_date=common_date,
                lessons=json.dumps(lessons))
            c.put()
            resp[c.for_class] = c.key.urlsafe()
        self.jsonify(
            success=True,
            kind='Change',
            items=resp
        )

class SpecificChange(BaseHandler):
    @BaseHandler.item_method('Change')
    def get(self, change_id):
        return lambda: ndb.Key(urlsafe=change_id).get()

    @BaseHandler.wrap_exception
    def delete(self, change_id):
        if not users.get_current_user():
            self.fail(401, 'Authorization is required to access this resource.')
            return
        elif not users.is_current_user_admin():
            self.fail(403,
                'Administrative privileges are required to access this resource.')
            return

        try:
            change = ndb.Key(urlsafe=change_id)
        except Exception:
            self.fail(400, 'Your request was malformed.')
            return

        change.delete()
        self.jsonify(success=True)

class ChangesForClass(BaseHandler):
    @BaseHandler.collection_method('Change')
    def get(self, class_name):
        return Change.get_week_for_class(class_name), [Change.for_date]

class ChangesForDate(BaseHandler):
    @BaseHandler.collection_method('Change')
    def get(self, date):
        date = ISO8601.parse(date)
        return Change.get_for_date(date), [Change.for_class]
