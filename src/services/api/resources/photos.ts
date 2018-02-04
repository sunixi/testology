
export const Photos = {
    name: 'Photos',
    endpoint: 'photos',
    relations: {
        belongsTo: {
            users: {
                foreignKey: 'userId',
                localField: 'user'
            }
        }
    }
};
