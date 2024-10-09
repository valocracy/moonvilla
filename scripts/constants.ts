
const ALIEN_BASE_IPFS_URI = 'ipfs://QmSWgkGqps1TRuJCAc6QYoV2Jja6upBvxXQURSp2gQUyVv'; //coleção mooner (json)
const CATALOG_SLOT_NAME_MOONER = 'ipfs://Qmec28dXwnReKnmH5141wrDaR7HJ15JU7tWfAhnHmCE3ws'//slot mooner que vai ficar no passport
const COLLECTION_IMAGE_MOONER = 'ipfs://Qme2n7zswtQBKSJDMx2JVRQqnN1fvPUjH8XYRciS6VrGp5/mooner/mooner-collection.json'//imagem de perfil da colleção mooner
const COLLECTION_IMAGE_PASSPORT = 'ipfs://Qme2n7zswtQBKSJDMx2JVRQqnN1fvPUjH8XYRciS6VrGp5/passport/passport-collection.json'//imagem de perfil da colleção passport

// PASSPORT FIXED PARTS
const PASSPORT_V1_FIXED_PART_ID = 1;
const PASSPORT_V2_FIXED_PART_ID = 2;

// SLOT PARTS
const ALIEN_SLOT_PART_ID = 300001;

 
// PART TYPES (Defined by standard)
const PART_TYPE_SLOT = 1;
const PART_TYPE_FIXED = 2;
 
// Z INDEXES
const Z_INDEX_BODY = 2;
const Z_INDEX_HEAD = 4;
const Z_INDEX_HAND_ITEMS = 6;
const Z_INDEX_HANDS = 8;
 
// Equippable groups
const EQUIPPABLE_GROUP_FOR_CHUNKIES_DEFAULT = 1; // Somente no caso de querermos que todos os chunkies possam ser posteriormente equipados em algo


const ALIEN_EQUIPPABLE_GROUP = ALIEN_SLOT_PART_ID;
 
export {

  PART_TYPE_SLOT,
  PART_TYPE_FIXED,
  Z_INDEX_BODY,
  Z_INDEX_HEAD,
  Z_INDEX_HAND_ITEMS,
  Z_INDEX_HANDS,
  EQUIPPABLE_GROUP_FOR_CHUNKIES_DEFAULT,
  ALIEN_BASE_IPFS_URI,
  ALIEN_SLOT_PART_ID,
  ALIEN_EQUIPPABLE_GROUP,
  PASSPORT_V1_FIXED_PART_ID,
  PASSPORT_V2_FIXED_PART_ID,
  CATALOG_SLOT_NAME_MOONER,
  COLLECTION_IMAGE_MOONER,
  COLLECTION_IMAGE_PASSPORT
};