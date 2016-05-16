'use strict';

window.EdaemonAdmin = {
    ChangeList: {
        init: (target, { data }) => {
            require.ensure([], () => {
                const ChangeList = require('./ChangeList').default;
                ChangeList.init(target, data);
            }, 'ChangeList');
        }
    },
    ChangeEntryPane: {
        init: (target) => {
            require.ensure([], () => {
                const ChangeEntryPane = require('./ChangeEntryPane').default;
                ChangeEntryPane.init(target);
            }, 'ChangeEntryPane');
        }
    },
    ConfirmActionButton: {
        initDeleteChange: (target, { id }) => {
            require.ensure([], () => {
                const API = require('./api');
                const ConfirmActionButton = require('./components/ConfirmActionButton').default;
                const React = require('react');
                const ReactDOM = require('react-dom');

                ReactDOM.render(React.createElement(ConfirmActionButton,
                {
                    className: 'btn btn-danger',
                    callback: () => {
                        API.Change.delete(id)
                        .then(success => {
                            if (success) {
                                window.setTimeout(() =>
                                    window.location.assign('/admin/'),
                                    500 // some stuff needs to process
                                );
                            }
                        });
                    }
                },
                React.createElement('span', { className: 'glyphicon glyphicon-trash' }),
                ' Dzēst'
                ), target);
            }, 'ConfirmActionButton');
        }
    }
}
