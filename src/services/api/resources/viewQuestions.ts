
export const ViewQuestions = {
    name: 'ViewQuestions',
    endpoint: 'view-questions',
    relations: {
        belongsTo: {
            users: {
                foreignKey: 'userId',
                localField: 'user'
            }
        }
    }
};
