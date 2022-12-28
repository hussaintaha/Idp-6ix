import { Link, Toast, Frame, IndexTable, Card, useIndexResourceState, Button, Layout, Page, TextField } from '@shopify/polaris';
import { useState, useEffect, useCallback } from 'react';
import { useAuthenticatedFetch } from '../hooks/useAuthenticatedFetch';

const KeyPage = () => {

    const fetch = useAuthenticatedFetch();
    const [active, setActive] = useState(false);
    const [activeNew, setActiveNew] = useState(false);
    const [value, setValue] = useState('');
    const [btnloading, setBtnloading] = useState(false);
    const [btnloadingTwo, setBtnloadingTwo] = useState(false);

    const handleChange = useCallback((newValue) => setValue(newValue), []);
    const toggleActive = useCallback(() => setActive((active) => !active), []);
    const toggleActiveNew = useCallback(() => setActiveNew((activeNew) => !activeNew), []);

    useEffect(async() => {

        const response = await fetch("/api/idpkey/get")
        .then(response => response.json());

        setValue(response.data.idpkey);
    }, []);

    const toastMarkup = active ? (
        <Toast content="Saved Successfully!" onDismiss={toggleActive} />
    ) : null;

    const toastMarkupNew = activeNew ? (
    <Toast content="Script Added Successfully!" onDismiss={toggleActiveNew} />
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

        setBtnloadingTwo(true);

        const response = await fetch("/api/script/create")
        .then(response => response.json());

        setBtnloadingTwo(false);
        toggleActiveNew();
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
                                    <Button onClick={handleSubmit} loading={btnloading} primary>Save Key</Button> <Button onClick={handleAddScript} loading={btnloadingTwo} >Enable App</Button>
                                </div>
                            </Card>
                        </Layout.Section>
                    </Layout>
                    <Frame>
                        {toastMarkup}
                    </Frame>
                    <Frame>
                        {toastMarkupNew}
                    </Frame>
                </Page>
            </div>
        </>
    )
};

export default KeyPage;