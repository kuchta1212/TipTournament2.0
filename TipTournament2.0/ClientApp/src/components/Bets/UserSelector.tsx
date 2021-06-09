import * as React from 'react';
import { User } from "../../typings/index"

interface UserSelectorState {
}

interface UserSelectorProps {
    id: number,
    users: User[],
    onUserSelect: (event: any, id: number) => void,
    onSelectorRemove: (event: any, id: number) => void,
    disabled: boolean,
    value: string
}

export class UserSelector extends React.Component<UserSelectorProps, UserSelectorState> {

    constructor(props: UserSelectorProps) {
        super(props);
    }

    public render() {
        return (
            <div id={this.getId()} className="input-group mb-3">
                <div className="input-group-prepend">
                    <label className="input-group-text" htmlFor="usersSelect">Vyber hráče:</label>
                </div>
                <select className="custom-select" id="usersSelect" defaultValue={this.props.value} onChange={(event) => this.props.onUserSelect(event, this.props.id)} disabled={this.props.disabled}>
                    <option key="defaultOption" value="default" disabled>---</option> 
                    {this.props.users.map((user, index) => {
                            return <option key={user.id} value={user.id}>{user.userName}</option>
                    })}
                </select>
                {
                    this.props.id != 0
                        ? <div className="input-group-append"><button className="btn btn-link" type="button" onClick={(event) => this.props.onSelectorRemove(event, this.props.id)}><img src={process.env.PUBLIC_URL + 'icons/close.svg'} width="20" height="20" /></button></div>
                        : <div/>
                }
               
            </div>
        );
    }

    private getId(): string {
        return "UserSelectorId-" + this.props.id;
    }
}

