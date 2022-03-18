import React from 'react';

import  {getAll, getById} from '../services/user.services';

class AdminPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            users: null
        };
    }

    componentDidMount() {
        getAll();
    }

    render() {
        const { users } = this.state;
        return (
            <div>
                <h1>Admin</h1>
                <p>This page can only be accessed by administrators.</p>
                <div>
                    All users from secure (admin only) api end point:
                    {users &&
                        <ul>
                            {users.map(user =>
                                <li key={user.id}>{user.firstName} {user.lastName}</li>
                            )}
                        </ul>
                    }
                </div>
            </div>
        );
    }
}

export default { AdminPage };