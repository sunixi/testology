
export const Blocks = {
    name: 'Blocks',
    endpoint: 'blocks/user',
    relations: {
        belongsTo: {
            users: {
                foreignKey: 'userId',
                localField: 'user'
            }
        }
    }
};
