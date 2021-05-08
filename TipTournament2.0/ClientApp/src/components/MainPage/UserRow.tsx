import * as React from 'react';
import { User } from "../../typings/index"


interface UserRowProps {
    user: User
}

export class UserRow extends React.Component<UserRowProps> {

    constructor(props: UserRowProps) {
        super(props);

        console.log(props.user);
    }

    public render() {
        return (
            <React.Fragment>
                <td>{this.props.user.userName}</td>
                <td>{this.props.user.points}</td>
            </React.Fragment>
        );

    }
}

