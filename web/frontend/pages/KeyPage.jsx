import { Link, Toast, Frame, IndexTable, Card, useIndexResourceState, Button, Layout, Page, TextField } from '@shopify/polaris';
import { useState, useEffect, useCallback } from 'react';
import { useAuthenticatedFetch } from '../hooks/useAuthenticatedFetch';

const KeyPage = () => {

    const fetch = useAuthenticatedFetch();
    const [active, setActive] = useState(false);
    const [value, setValue] = useState('');
    const [btnloading, setBtnloading] = useState(false);

    const handleChange = useCallback((newValue) => setValue(newValue), []);
    const toggleActive = useCallback(() => setActive((active) => !active), []);

    useEffect(async() => {

        const response = await fetch("/api/idpkey/save")
        .then(response => response.json());

        setValue(response.data[0].idpkey);
    }, []);

    const toastMarkup = active ? (
        <Toast content="Saved Successfully!" onDismiss={toggleActive} />
      ) : null;


    const handleSubmit = async() => {

        setBtnloading(true);

        const response = await fetch("/api/idpkey/save", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                idpkey: value
            })
        })
        .then(response => response.json());

        toggleActive();
        setBtnloading(false);
    };

    const handleAddScript = async() => {

        const response = await fetch("/api/script/create")
        .then(response => response.json());

        const secondResponse = await fetch("/api/idpkey/save", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                idpkey: value
            })
        })
        .then(response => response.json());

        console.log('secondResponse', secondResponse);
    };

    return (
        <>
            <div>
                <Page fullWidth>
                    <Layout>
                        <Layout.Section>
                            <Card
                                sectioned
                                title="Configure Page"
                            >
                                <div>
                                    <TextField
                                        label="Enter your Idp Key"
                                        value={value}
                                        placeholder="example: yourWriteKey"
                                        onChange={handleChange}
                                        autoComplete="off"
                                    />
                                    <br />
                                    <Button onClick={handleSubmit} loading={btnloading} primary>Save Key</Button> <Button onClick={handleAddScript}>Enable App</Button>
                                </div>
                            </Card>
                        </Layout.Section>
                    </Layout>
                    <Frame>
                        {toastMarkup}
                    </Frame>
                </Page>
            </div>
        </>
    )
};

export default KeyPage;