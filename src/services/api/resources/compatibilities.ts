
export const Compatibilities = {
    name: 'Compatibilities',
    endpoint: 'compatibilities',
    relations: {
        belongsTo: {
            users: {
                foreignKey: 'userId',
                localField: 'user'
            }
        }
    }
};
