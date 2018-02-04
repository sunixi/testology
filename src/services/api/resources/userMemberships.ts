
export const UserMemberships = {
    name: 'UserMemberships',
    endpoint: 'memberships',
    relations: {
        belongsTo: {
            users: {
                foreignKey: 'userId',
                localField: 'user'
            }
        }
    }
};
