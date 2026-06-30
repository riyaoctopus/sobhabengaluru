const axios = require('axios');
require('dotenv').config();

async function getFields() {
    try {
        const response = await axios.post('https://accounts.zoho.com/oauth/v2/token', null, {
            params: {
                client_id: process.env.ZOHO_CLIENT_ID,
                client_secret: process.env.ZOHO_CLIENT_SECRET,
                refresh_token: process.env.ZOHO_REFRESH_TOKEN,
                grant_type: 'refresh_token'
            }
        });

        const accessToken = response.data.access_token;
        const moduleName = process.env.ZOHO_MODULE_NAME || 'Cold_Call';

        const fieldsRes = await axios.get(`https://www.zohoapis.com/crm/v2.1/settings/fields?module=${moduleName}`, {
            headers: {
                'Authorization': `Zoho-oauthtoken ${accessToken}`
            }
        });

        const fields = fieldsRes.data.fields.map(f => ({
            api_name: f.api_name,
            field_label: f.field_label,
            data_type: f.data_type
        }));
        
        console.log(JSON.stringify(fields, null, 2));
    } catch (error) {
        if (error.response) {
            console.error(JSON.stringify(error.response.data, null, 2));
        } else {
            console.error(error.message);
        }
    }
}

getFields();
