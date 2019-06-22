const partyModel = require('../models/party.model.server');
const userModel = require('../models/user.model.server');
const ObjectId = require('mongoose').Types.ObjectId;


createParty = (party) => {
    return partyModel.create(party)
}

findPartyById = (id) => {
    return partyModel.findById(id); 
}

findAllParties = () => {
    return partyModel.find();
}

deleteParty = (id) => {
    return partyModel.findByIdAndDelete(id);
}

updateParty = (id, party) => {
    return partyModel.updateOne({_id: id}, {$set: party});
}

addUserToParty = async(userId, partyId) => {
    var userToAdd = await findUser(userId).then(user => user)
    return partyModel.findOneAndUpdate({_id: partyId},
                                {$push: {attendees: userToAdd}},
                                {new:true, upsert:true});}


findUser = (userId) => {
    return userModel.findById(userId).exec();
}

removeUserFromParty = (userId, partyId) => {
    return partyModel.update({_id: partyId}, {$pull: {attendees: {_id: userId}}});
}

addSong = (partyId, spotifyId, trackName, artistName) => {
    const song = {
        _id: ObjectId(spotifyId),
        spotifyId: spotifyId,
        trackName: trackName,
        artistName: artistName,
        upvotes: [],
        downvotes: []
    }
    return partyModel.update({_id: partyId}, {$push: {queue: song}}, {new:true, upsert:true});
}

removeSong = (partyId, sid) => {
    return partyModel.update({_id: partyId}, {$pull: {queue: {'spotifyId': sid}}})
}

setPartyLeader = (partyId, userId) => {
    return partyModel.update({_id, partyId}, {$set: {partyLeader: userId}});
}


module.exports = {
    createParty,
    findAllParties,
    findPartyById,
    deleteParty,
    updateParty,
    addUserToParty,
    removeUserFromParty,
    addSong,
    removeSong,
    setPartyLeader
}