import _ from 'lodash';
import Categories from '../../modules/categories/categories.model';
import IdManager from '../../utils/IdManager';
import casual from 'casual';

// interface IPackageVars extends DeepPartial<IPackage> {}
// interface ISubscriberPackageVars extends DeepPartial<ISubscriberPackage> {}

export default {
    clear() {
        return Categories.destroyAll().catch(e => '');
    },

    create(partial = {}) {
        return new Categories(_.merge({ id: IdManager.forDB(), parentId: null, label: casual.title }, partial))
            .save(null, { method: 'insert' })
            .then(r => r.serialize());
    },
};
