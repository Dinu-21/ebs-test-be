import ShortUniqueId from 'short-unique-id';

const uid = new ShortUniqueId({ length: 20 });

const IdManager = {
    forDB: () => uid(),
};
export default IdManager;
