const axios = require('axios');
require('dotenv').config();

async function testCRM() {
    const dcs = [
        { name: 'US (.com)', accounts: 'https://accounts.zoho.com', api: 'https://www.zohoapis.com' },
        { name: 'India (.in)', accounts: 'https://accounts.zoho.in', api: 'https://www.zohoapis.in' },
        { name: 'Europe (.eu)', accounts: 'https://accounts.zoho.eu', api: 'https://www.zohoapis.eu' },
        { name: 'Australia (.com.au)', accounts: 'https://accounts.zoho.com.au', api: 'https://www.zohoapis.com.au' }
    ];

    for (const dc of dcs) {
        console.log(`\nTesting DC: ${dc.name}...`);
        try {
            const response = await axios.post(`${dc.accounts}/oauth/v2/token`, null, {
                params: {
                    client_id: process.env.ZOHO_CLIENT_ID,
                    client_secret: process.env.ZOHO_CLIENT_SECRET,
                    refresh_token: process.env.ZOHO_REFRESH_TOKEN,
                    grant_type: 'refresh_token'
                }
            });

            console.log(`Token response for ${dc.name}:`, response.data);

            if (response.data.access_token) {
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

                const crmRes = await axios.post(`${dc.api}/crm/v2.1/${moduleName}`, recordData, {
                    headers: {
                        'Authorization': `Zoho-oauthtoken ${accessToken}`,
                        'Content-Type': 'application/json'
                    }
                });

                console.log(`CRM response for ${dc.name}:`, JSON.stringify(crmRes.data, null, 2));
                return; // Stop if we find a working one
            }
        } catch (error) {
            if (error.response) {
                console.error(`Error response for ${dc.name}:`, JSON.stringify(error.response.data, null, 2));
            } else {
                console.error(`Error for ${dc.name}:`, error.message);
            }
        }
    }
}

testCRM();
