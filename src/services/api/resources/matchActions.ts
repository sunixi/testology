
export const MatchActions = {
    name: 'MatchActions',
    endpoint: 'math-actions/user',
    relations: {
        belongsTo: {
            users: {
                foreignKey: 'userId',
                localField: 'user'
            }
        }
    }
};
