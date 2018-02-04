
export const Users = {
    name: 'Users',
    endpoint: 'users',
    relations: {
        hasMany: {
            permissions: {
                foreignKey: 'userId',
                localField: 'permissions'
            },
            photos: {
                foreignKey: 'userId',
                localField: 'photos'
            },
            viewQuestions: {
                foreignKey: 'userId',
                localField: 'viewQuestions'
            },
            searchUsers: {
                foreignKey: 'userId',
                localField: 'searchUsers'
            }
        },
        hasOne: {
            avatars: {
                foreignKey: 'userId',
                localField: 'avatar'
            },
            blocks: {
                foreignKey: 'userId',
                localField: 'block'
            },
            matchActions: {
                foreignKey: 'userId',
                localField: 'matchActions'
            },
            compatibilities: {
                foreignKey: 'userId',
                localField: 'compatibility'
            },
            memberships: {
                foreignKey: 'userId',
                localField: 'membership'
            }
        }
    }
};

export const UsersProperties = {
    realName: {
        get: function () {
            return this.displayName ? this.displayName : this.userName;
        }
    }
};
