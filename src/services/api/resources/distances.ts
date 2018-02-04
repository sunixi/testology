
export const Distances = {
    name: 'Distances',
    endpoint: 'distances',
    relations: {
        belongsTo: {
            users: {
                foreignKey: 'userId',
                localField: 'user'
            }
        }
    }
};
