import UserBox from 'components/userBox/UserBoxComponent';
import React from 'react';
import { useSelector } from 'react-redux';
import { authorizeSelector } from 'store/reducers/authorize/authorizeSelector';
import { IUserBoxListProps } from './IUserBoxListProps';

const selectCurrentUser = authorizeSelector.selectCurrentUser();

export function UserBoxListComponent(props: IUserBoxListProps) {
    const currentUser = useSelector(selectCurrentUser);

    const uid = currentUser.get('userId');
    const userList = () => {
        const users = props.users;
        const userBoxList: any[] = [];
        if (users) {
            users.forEach((user) => {
                const userId = user.get('userId') as string;
                if (uid !== userId) {
                    userBoxList.push(<UserBox key={userId} user={user} />);
                }
            });
        }
        return userBoxList;
    };
    return <div className="grid grid__1of4 grid__space-around">{userList()}</div>;
}

export default UserBoxListComponent;
