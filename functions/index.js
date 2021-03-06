const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

exports.takipGerceklesti = functions.firestore.document('takipciler/{takipEdilenId}/kullanicininTakipcileri/{takipEdenKullaniciId}').onCreate(async (snapshot, context) => {
    const takipEdilenId = context.params.takipEdilenId;
    const takipEdenId = context.params.takipEdenKullaniciId;

   const gonderilerSnapshot = await admin.firestore().collection("gonderiler").doc(takipEdilenId).collection("kullaniciGonderileri").get();

   gonderilerSnapshot.forEach((doc)=>{
        if(doc.exists){
            const gonderiId = doc.id;
            const gonderiData = doc.data();

            admin.firestore().collection("akislar").doc(takipEdenId).collection("kullaniciAkisGonderileri").doc(gonderiId).set(gonderiData);
        }
   });
});

exports.takiptenCikildi = functions.firestore.document('takipciler/{takipEdilenId}/kullanicininTakipcileri/{takipEdenKullaniciId}').onDelete(async (snapshot, context) => {
    const takipEdilenId = context.params.takipEdilenId;
    const takipEdenId = context.params.takipEdenKullaniciId;

   const gonderilerSnapshot = await admin.firestore().collection("akislar").doc(takipEdenId).collection("kullaniciAkisGonderileri").where("yayinlayanId", "==", takipEdilenId).get();

   gonderilerSnapshot.forEach((doc)=>{
        if(doc.exists){
            doc.ref.delete();
        }
   });
});

exports.yeniGonderiEklendi = functions.firestore.document('gonderiler/{takipEdilenKullaniciId}/kullaniciGonderileri/{gonderiId}').onCreate(async (snapshot, context) => {
    const takipEdilenId = context.params.takipEdilenKullaniciId;
    const gonderiId = context.params.gonderiId;
    const yeniGonderiData = snapshot.data();

    const takipcilerSnapshot = await admin.firestore().collection("takipciler").doc(takipEdilenId).collection("kullanicininTakipcileri").get();

    takipcilerSnapshot.forEach(doc=>{
        const takipciId = doc.id;
        admin.firestore().collection("akislar").doc(takipciId).collection("kullaniciAkisGonderileri").doc(gonderiId).set(yeniGonderiData);
    });
});

exports.gonderiGuncellendi = functions.firestore.document('gonderiler/{takipEdilenKullaniciId}/kullaniciGonderileri/{gonderiId}').onUpdate(async (snapshot, context) => {
    const takipEdilenId = context.params.takipEdilenKullaniciId;
    const gonderiId = context.params.gonderiId;
    const guncellenmisGonderiData = snapshot.after.data();

    const takipcilerSnapshot = await admin.firestore().collection("takipciler").doc(takipEdilenId).collection("kullanicininTakipcileri").get();

    takipcilerSnapshot.forEach(doc=>{
        const takipciId = doc.id;
        admin.firestore().collection("akislar").doc(takipciId).collection("kullaniciAkisGonderileri").doc(gonderiId).update(guncellenmisGonderiData);
    });
});

exports.gonderiSilindi = functions.firestore.document('gonderiler/{takipEdilenKullaniciId}/kullaniciGonderileri/{gonderiId}').onDelete(async (snapshot, context) => {
    const takipEdilenId = context.params.takipEdilenKullaniciId;
    const gonderiId = context.params.gonderiId;

    const takipcilerSnapshot = await admin.firestore().collection("takipciler").doc(takipEdilenId).collection("kullanicininTakipcileri").get();

    takipcilerSnapshot.forEach(doc=>{
        const takipciId = doc.id;
        admin.firestore().collection("akislar").doc(takipciId).collection("kullaniciAkisGonderileri").doc(gonderiId).delete();
    });
});

/*
exports.kayitSilindi = functions.firestore.document('deneme/{docId}').onDelete((snapshot, context) => {
    admin.firestore().collection("gunluk").add({
        "aciklama":"Deneme koleksiyonundan kay??t silindi."
    });
});
exports.kayitGuncellendi = functions.firestore.document('deneme/{docId}').onUpdate((change, context) => {
    admin.firestore().collection("gunluk").add({
        "aciklama":"Deneme koleksiyonunda kay??t g??ncellendi."
    });
});
exports.yazmaGerceklesti = functions.firestore.document('deneme/{docId}').onWrite((change, context) => {
    admin.firestore().collection("gunluk").add({
        "aciklama":"Deneme koleksiyonunda veri ekleme, silme, g??ncelleme i??lemlerinden biri ger??ekle??ti."
    });
});
*/
//////////----------//////////----------//////////----------//////////----------//////////
/*
const functions = require("firebase-functions");
const admin = require('firebase-admin');
admin.initializeApp();

//Firebase functions, cloud fonksiyonlar?? olu??turmam??z?? ve 
//bu fonksiyonlar??n hangi durumlarda ??al????aca????n?? belirler

//Firebase admin, firebase servisindeki verileri y??netebilmemizi sa??lar
//silme, g??ncelleme, ekleme i??lemleri gibi...

exports.takipGerceklesti = functions.firestore.document('takipciler/{takipEdilenId}/kullanicininTakipcileri/{takipEdenKullaniciId}').onCreate(async(snapshot, context) => {
    const takipEdilenId = context.params.takipEdilenId;
    const takipEdenId = context.params.takipEdenKullaniniId;

    const gonderilerSnapshot = await admin.firestore().collection("gonderiler").doc(takipEdilenId).collection("kullaniciGonderileri").get();
    //Takip etti??imiz kullan??c??n??n b??t??n g??nderilerini ??ektik

    gonderilerSnapshot.forEach((doc)=>{
        if (doc.exists) {
            const gonderiId = doc.id;
            const gonderiData = doc.data(); //G??nderi i??eri??i

            admin.firestore().collection("akislar").doc(takipEdenId).collection("kullaniciAkisGonderileri").doc(gonderiId).set(gonderiData);
        }
    ///Takip edilen kullan??c??n??n g??nderilerini getirdik. 
    ///Bu g??nderileri snapshot de??i??kenine atad??k ve forEach'ta d??nerek aki??lar koleksiyonuna atad??k    
    });
});

exports.takiptenCikildi = functions.firestore.document('takipciler/{takipEdilenId}/kullanicininTakipcileri/{takipEdenKullaniciId}').onDelete(async(snapshot, context) => {
    const takipEdilenId = context.params.takipEdilenId;
    const takipEdenId = context.params.takipEdenKullaniniId;

    const gonderilerSnapshot = await admin.firestore().collection("akislar").doc(takipEdenId).collection("kullaniciAkisGonderileri").where("yayinlayanId","==",takipEdilenId).get();
    ///Daha ??nce ak????lar koleksiyonuna ekledi??imiz g??nderileri takip eden id'ye g??re getirdik. 

    gonderilerSnapshot.forEach((doc)=>{
        if (doc.exists) {
            doc.ref.delete();
        }
    });
});

exports.yeniGonderiEklendi = functions.firestore.document('gonderiler/{takipEdilenKullaniciId}/kullaniciGonderileri{gonderiId}').onCreate(async(snapshot, context) => {
    const takipEdilenId = context.params.takipEdilenKullaniciId;
    const gonderiId = context.params.gonderiId;
    const yeniGonderiData = snapshot.data; //Yeni eklenen g??nderinin i??eri??i

    const takipcilerSnapshot = await admin.firestore().collection("takipciler").doc(takipEdilenId).collection("kullanicininTakipcileri").get();
    takipcilerSnapshot.forEach((doc)=>{
        const takipciId = doc.id;
        admin.firestore().collection("akislar").doc(takipciId).collection("kullaniciAkisGonderileri").doc(gonderiId).set(yeniGonderiData);
    });
    ///Takip edilen kullan??c??n??n takip??ilerini getirdik. Bu takip??ileri forEach'ta d??nerek 
    ///id'lerini takipciId de??i??kenine atad??k. Daha sonra da id'sini bildi??imiz kullan??c??n??n g??nderileri koleksiyonuna 
    ///takipedilen kullan??c??n??n payla??t?????? resmin id'sini ekledik. 
});

exports.gonderiGuncellendi = functions.firestore.document('gonderiler/{takipEdilenKullaniciId}/kullaniciGonderileri{gonderiId}').onUpdate(async(snapshot, context) => {
    const takipEdilenId = context.params.takipEdilenKullaniciId;
    const gonderiId = context.params.gonderiId;
    const guncellenmisGonderiData = snapshot.after.data; //Yeni eklenen g??nderinin i??eri??i

    const takipcilerSnapshot = await admin.firestore().collection("takipciler").doc(takipEdilenId).collection("kullanicininTakipcileri").get();
    takipcilerSnapshot.forEach((doc)=>{
        const takipciId = doc.id;
        admin.firestore().collection("akislar").doc(takipciId).collection("kullaniciAkisGonderileri").doc(gonderiId).update(guncellenmisGonderiDataGonderiData);
    });
    ///Takip edilen kullan??c??n??n takip??ilerini getirdik. Bu takip??ileri forEach'ta d??nerek 
    ///id'lerini takipciId de??i??kenine atad??k. Daha sonra da id'sini bildi??imiz kullan??c??n??n g??nderileri koleksiyonuna 
    ///takipedilen kullan??c??n??n payla??t?????? resmin id'sini ekledik. 
});

exports.gonderiSilindi = functions.firestore.document('gonderiler/{takipEdilenKullaniciId}/kullaniciGonderileri{gonderiId}').onDelete(async(snapshot, context) => {
    const takipEdilenId = context.params.takipEdilenKullaniciId;
    const gonderiId = context.params.gonderiId;

    const takipcilerSnapshot = await admin.firestore().collection("takipciler").doc(takipEdilenId).collection("kullanicininTakipcileri").get();
    takipcilerSnapshot.forEach((doc)=>{
        const takipciId = doc.id;
        admin.firestore().collection("akislar").doc(takipciId).collection("kullaniciAkisGonderileri").doc(gonderiId).delete(guncellenmisGonderiDataGonderiData);
    });
    ///Takip edilen kullan??c??n??n takip??ilerini getirdik. Bu takip??ileri forEach'ta d??nerek 
    ///id'lerini takipciId de??i??kenine atad??k. Daha sonra da id'sini bildi??imiz kullan??c??n??n g??nderileri koleksiyonuna 
    ///takipedilen kullan??c??n??n payla??t?????? resmin id'sini ekledik. 
});

/*
exports.kayitSilindi = functions.firestore.document('deneme/{docId}').onDelete((snapshot, context) => {
    admin.firestore().collection("gunluk").add({
        "aciklama":"Deneme koleksiyonundan kay??t silindi"
    });
});

exports.kayitGuncellendi = functions.firestore.document('deneme/{docId}').onUpdate((change, context) => {
    admin.firestore().collection("gunluk").add({
        "aciklama":"Deneme koleksiyonundaki kay??t g??ncellendi"
    });
});

exports.yazmaGerceklesti = functions.firestore.document('deneme/{docId}').onWrite((change, context) => {
    admin.firestore().collection("gunluk").add({
        "aciklama":"Deneme koleksiyonunda veri; ekleme, silme, g??ncelleme i??lemlerinden biri ger??ekle??ti"
    });
});
//exports.gunlukekle: diyerek ad??n?? belirledik
//onUpdate ve onWrite olaylar??nda verilerde bir de??i??iklik oldu??u i??in snapshot yerine change yazd??k
*/
