import { User } from '../generated/schema';

export function findOrCreateUser(id: string): User {
    let user = User.load(id)

    if (!user) {
        user = new User(id)
        user.numberOfCreations = 0;
        user.save()
    }

    return user as User
}
