import * as React from 'react';
import { User } from "../../typings/index"

interface UserSelectorState {
}

interface UserSelectorProps {
    users: User[],
    onUserSelect: (event: any) => void
}

export class UserSelector extends React.Component<UserSelectorProps, UserSelectorState> {

    constructor(props: UserSelectorProps) {
        super(props);
    }

    public render() {
        return (
            <React.Fragment>
                <label htmlFor="usersSelect">Vyber hráče:</label>
                <select id="usersSelect" defaultValue={'default'} onChange={this.props.onUserSelect} >
                    <option key="defaultOption" value="default" disabled>---</option> 
                    {this.props.users.map((user, index) => {
                        return <option key={user.id} value={user.id}>{user.userName}</option>
                    })}
                </select>
            </React.Fragment>
        );
    }
}

