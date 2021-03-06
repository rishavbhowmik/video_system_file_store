const jwt = require('jsonwebtoken')
const private_manifest = require('../manifest/private.json')
const {Photos} = require('../actions/photos')
const {User} = require('../actions/user')

module.exports = [
    {
        method: 'POST',
        url: '/set_file/profile_photo',
        handler: async (request, reply) => {
            try{
                const file = await request.file()
                const fields = file.fields
                const user = User.verify(fields.user_token.value)
                const file_buffer = await fields.file.toBuffer()
                const img100x100 = await Photos.uploadphoto(user.user_id, file_buffer, 100, 100);
                const img250x250 = await Photos.uploadphoto(user.user_id, file_buffer, 250, 250);
                const img500x500 = await Photos.uploadphoto(user.user_id, file_buffer, 500, 500);
                /*console.log(
                    {img100x100, img250x250, img500x500}
                );*/
                const result = await User.update_user_set(
                    fields.user_token.value,
                    {
                        profile_pic:{
                            "100x100":img100x100.public_token,
                            "250x250":img250x250.public_token,
                            "500x500":img500x500.public_token
                        }
                    }
                )
                return result.value?result.value.meta:null
            }catch(e){
                reply.code(504)
                console.log(e);
                return {error:e.message, result:null}
            }
        }
    }
]