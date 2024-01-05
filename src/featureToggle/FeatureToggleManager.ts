import { FeatureTogglesResponse, hentFeatureToggles } from '../redux/api';
import { FeatureToggles } from './FeatureToggles';


const TEN_SECONDS = 10000

class FeatureToggleManager {
    private lastFetch?: number
    private toggles: FeatureTogglesResponse

    constructor() {
        this.toggles = this.defaultToggles()
    }

    private defaultToggles = (): FeatureTogglesResponse => {
        return {
            'modiacontextholder.ikke-fnr-i-path': false
        };
    };

    private getToggles = async () => {
        const res = await hentFeatureToggles()
        if (res.data) {
            this.toggles = res.data
            this.lastFetch = Date.now()
        }
    }

    private shouldFetchToggles = (): boolean => !this.lastFetch || this.lastFetch < Date.now() - TEN_SECONDS

    getToggle = async (toggleId: FeatureToggles): Promise<boolean> => {
        if (this.shouldFetchToggles()) {
            await this.getToggles()
        }
        return !!this.toggles[toggleId]
    }
}

export default new FeatureToggleManager()