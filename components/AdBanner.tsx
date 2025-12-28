import React from 'react';
import { View, Platform } from 'react-native';
import { BannerAd, BannerAdSize, TestIds } from 'react-native-google-mobile-ads';

const adUnitId = __DEV__
    ? TestIds.BANNER
    : Platform.select({
        ios: 'ca-app-pub-xxxxxxxxxxxxxxxx/xxxxxxxxxx', // Replace with real ID
        android: 'ca-app-pub-xxxxxxxxxxxxxxxx/xxxxxxxxxx', // Replace with real ID
    }) || TestIds.BANNER;

export default function AdBanner() {
    // In a real scenario, we might want to check if the user has purchased "Remove Ads"
    // const { isPremium } = usePremium();
    // if (isPremium) return null;

    try {
        return (
            <View style={{ alignItems: 'center', width: '100%' }}>
                <BannerAd
                    unitId={adUnitId}
                    size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
                    requestOptions={{
                        requestNonPersonalizedAdsOnly: true,
                    }}
                />
            </View>
        );
    } catch (e) {
        // Fallback if ad fails to load or simpler dev environment
        return null;
    }
}
