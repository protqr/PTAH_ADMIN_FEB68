export const TYPEPOSTURES = {
  TYPE_1: "เรียนรู้การจัดท่าในชีวิตประจำวัน",
  TYPE_2: "เคลื่อนไหวข้อต่อส่วนแขน",
  TYPE_3: "การเคลื่อนไหวข้อไหล่",
  TYPE_4: "การเคลื่อนไหวข้อต่อส่วนขา",
  TYPE_5: "การฝึกยกกล้ามเนื้อสะโพก",
};

export const CHOOSEPOSTURES = [
  "ท่าทั้งหมด",
  "ท่าที่ 1",
  "ท่าที่ 2",
  "ท่าที่ 3",
  "ท่าที่ 4",
  "ท่าที่ 5",
  "ท่าที่ 6",
];

export const TYPESTATUS = {
  TYPE_ST1: "กำลังรักษาอยู่",
  TYPE_ST2: "จบการรักษา",
};

export const RELATIONS = {
  FATHER: "พ่อ",
  MOTHER: "แม่",
  SIBLING: "พี่น้อง",
  SPOUSE: "คู่สมรส",
  CHILD: "ลูก",
  OTHER: "อื่นๆ",
  // otherRelations: "", // This will allow dynamic input for 'other' relationships
};

export const HAVECAREGIVER = {
  TYPE_CGV1: "มีผู้ดูแลที่บ้าน",
  TYPE_CGV2: "ไม่มีผู้ดูแล",
};

export const PREFIXDOCTOR = {
  PREFIX_MD1: "นายแพทย์",
  PREFIX_MD2: "แพทย์หญิง",
};

export const GENDER = {
  GENDER_01: "ชาย",
  GENDER_02: "หญิง",
};

export const POSTURES_SORT_BY = {
  NEWEST_FIRST: "ใหม่ที่สุด",
  OLDEST_FIRST: "เก่าสุด",
  ENG_ASCENDING: "เรียงจาก ก-ฮ",
  ENG_DESCENDING: "เรียงจาก ฮ-ก",
};

export const NOTIFY_TARGET_GROUP = {
  ALL: "news",
  // ALL: "ผู้ใช้ทั้งหมด",
  UNDER_TREATMENT: "ผู้ป่วยที่มีสถานะกำลังรักษาอยู่",
};

export const NOTIFY_TYPE = {
  IMPORTANT: "การแจ้งเตือนสำคัญ",
  GENERAL: "การแจ้งเตือนทั่วไป",
};

export const NOTIFY_STATUS = {
  PENDING: "รอการส่ง",
  SENT: "เผยแพร่แล้ว",
};

export const NOTIFY_SORT_BY = {
  NEWEST_FIRST: "ใหม่ล่าสุด",
  OLDEST_FIRST: "เก่าที่สุด",
  ENG_ASCENDING: "เรียงหัวข้อจาก ก-ฮ",
  ENG_DESCENDING: "เรียงหัวข้อจาก ฮ-ก",
};

export const FIREBASE_TOPIC = {
  ALL: "ALL",
  UNDER_TREATMENT: "UNDER_TREATMENT",
};

export const MISSIONS_SORT_BY = {
  NEWEST_FIRST: "ใหม่ที่สุด",
  OLDEST_FIRST: "เก่าสุด",
  STAGE_ASCENDING: "เรียงตามด่าน น้อย-มาก",
  STAGE_DESCENDING: "เรียงตามด่าน มาก-น้อย",
  NAME_ASCENDING: "เรียงชื่อ ก-ฮ",
  NAME_DESCENDING: "เรียงชื่อ ฮ-ก",
};
