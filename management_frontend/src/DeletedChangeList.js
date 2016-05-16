'use strict';

import React from 'react';
import ReactDOM from 'react-dom';

import API from './api';

class DeletedChangeListComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            items: props.data.slice()
        };
    }
    _handleChildRemoving(index) {
        let items = this.state.items.slice();
        API.Change.undelete(items[index].id);
        items.splice(index, 1);
        this.setState({ items });
    }
    render() {
        return <ul>
            {this.state.items.map((item, i) =>
            <li key={item.id}>
                <button className="btn btn-default btn-xs"
                    onClick={this._handleChildRemoving.bind(this, i)}>
                    <span className="glyphicon glyphicon-arrow-left" />
                </button>
                {' '}
                Datums: {item.for_date}, klase: {item.for_class}
            </li>
            )}
        </ul>;
    }
}

let DeletedChangeList = {
    init: (target, data) => {
        target.innerHTML = '';

        ReactDOM.render(
            <DeletedChangeListComponent data={data} />,
            target
        );
    }
}

export default DeletedChangeList;
