
export const Permissions = {
    name: 'Permissions',
    endpoint: 'permissions',
    relations: {
        belongsTo: {
            users: {
                foreignKey: 'userId',
                localField: 'user'
            }
        }
    }
};
