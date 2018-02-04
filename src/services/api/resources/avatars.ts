
export const Avatars = {
    name: 'Avatars',
    endpoint: 'avatars',
    relations: {
        belongsTo: {
            users: {
                foreignKey: 'userId',
                localField: 'user'
            }
        }
    }
};
