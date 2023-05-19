import _ from 'lodash';
import Products from '../../modules/products/products.model';
import IdManager from '../../utils/IdManager';
import casual from 'casual';

// interface IPackageVars extends DeepPartial<IPackage> {}
// interface ISubscriberPackageVars extends DeepPartial<ISubscriberPackage> {}

export default {
    clear() {
        return Products.destroyAll().catch(e => '');
    },

    create(partial = {}) {
        return new Products(_.merge({ id: IdManager.forDB(), categoryId: null, label: '' }, partial))
            .save(null, { method: 'insert' })
            .then(r => r.serialize());
    },
};
