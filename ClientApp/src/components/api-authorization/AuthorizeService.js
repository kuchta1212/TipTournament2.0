export class AuthorizeService {
    _callbacks = [];
    _nextSubscriptionId = 0;
    _user = null;
    _isAuthenticated = false;

    async isAuthenticated() {
        const user = await this.getUser();
        return !!user;
    }

    async getUser() {
        if (this._user) {
            return this._user;
        }

        try {
            const response = await fetch('/api/auth/user', { credentials: 'same-origin' });
            if (response.ok) {
                const data = await response.json();
                if (data.isAuthenticated) {
                    this._user = { name: data.userName, didPayed: data.didPayed };
                    this._isAuthenticated = true;
                    return this._user;
                }
            }
        } catch (error) {
            console.log('Error fetching user:', error);
        }

        this._user = null;
        this._isAuthenticated = false;
        return null;
    }

    async getAccessToken() {
        return null;
    }

    async signIn(state) {
        return this.redirect();
    }

    async signOut(state) {
        try {
            await fetch('/api/auth/logout', {
                method: 'POST',
                credentials: 'same-origin'
            });
            this._user = null;
            this._isAuthenticated = false;
            this.notifySubscribers();
            return this.success(state);
        } catch (error) {
            return this.error(error);
        }
    }

    updateState(user) {
        this._user = user;
        this._isAuthenticated = !!this._user;
        this.notifySubscribers();
    }

    subscribe(callback) {
        this._callbacks.push({ callback, subscription: this._nextSubscriptionId++ });
        return this._nextSubscriptionId - 1;
    }

    unsubscribe(subscriptionId) {
        const subscriptionIndex = this._callbacks
            .map((element, index) => element.subscription === subscriptionId ? { found: true, index } : { found: false })
            .filter(element => element.found === true);
        if (subscriptionIndex.length !== 1) {
            throw new Error(`Found an invalid number of subscriptions ${subscriptionIndex.length}`);
        }

        this._callbacks.splice(subscriptionIndex[0].index, 1);
    }

    notifySubscribers() {
        for (let i = 0; i < this._callbacks.length; i++) {
            const callback = this._callbacks[i].callback;
            callback();
        }
    }

    error(message) {
        return { status: AuthenticationResultStatus.Fail, message };
    }

    success(state) {
        return { status: AuthenticationResultStatus.Success, state };
    }

    redirect() {
        return { status: AuthenticationResultStatus.Redirect };
    }

    static get instance() { return authService }
}

const authService = new AuthorizeService();

export default authService;

export const AuthenticationResultStatus = {
    Redirect: 'redirect',
    Success: 'success',
    Fail: 'fail'
};
