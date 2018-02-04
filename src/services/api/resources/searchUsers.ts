
export const SearchUsers = {
    name: 'SearchUsers',
    endpoint: 'search-users',
    relations: {
        belongsTo: {
            users: {
                foreignKey: 'userId',
                localField: 'user'
            }
        }
    }
};
