const axios = require('axios');
require('dotenv').config();

async function testCRM() {
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

        const recordData = {
            data: [
                {
                    Name: "Test User",
                    Email: "test@example.com",
                    Phone: "1234567890",
                    Lead_Source: "Sobha Website"
                }
            ]
        };

        const crmRes = await axios.post(`https://www.zohoapis.com/crm/v2.1/${moduleName}`, recordData, {
            headers: {
                'Authorization': `Zoho-oauthtoken ${accessToken}`,
                'Content-Type': 'application/json'
            }
        });

        console.log(JSON.stringify(crmRes.data, null, 2));

    } catch (error) {
        if (error.response) {
            console.error(JSON.stringify(error.response.data, null, 2));
        } else {
            console.error(error.message);
        }
    }
}

testCRM();
