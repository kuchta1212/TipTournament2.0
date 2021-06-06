import * as React from 'react';
import { User } from "../../typings/index"

interface UserSelectorState {
}

interface UserSelectorProps {
    users: User[],
    onUserSelect: (event: any) => void,
    disabled: boolean
}

export class UserSelector extends React.Component<UserSelectorProps, UserSelectorState> {

    constructor(props: UserSelectorProps) {
        super(props);
    }

    public render() {
        return (
            <div className="input-group mb-3">
              <div className="input-group-prepend">
                    <label className="input-group-text" htmlFor="usersSelect">Vyber hráče:</label>
              </div>
                <select className="custom-select" id="usersSelect" defaultValue={'default'} onChange={this.props.onUserSelect} disabled={this.props.disabled}>
                <option key="defaultOption" value="default" disabled>---</option> 
                {this.props.users.map((user, index) => {
                        return <option key={user.id} value={user.id}>{user.userName}</option>
                })}
              </select>
            </div>
        );
    }
}

