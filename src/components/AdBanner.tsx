import React, { useEffect, useMemo, useRef } from 'react';
import { AppState, Platform, StyleSheet, View } from 'react-native';
import Constants from 'expo-constants';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

declare const require: (moduleId: string) => any;

type GoogleMobileAdsModule = {
  default?: () => { initialize: () => Promise<unknown> };
  BannerAd?: any;
  BannerAdSize?: any;
  TestIds?: any;
};

let didInit = false;

function isExpoGo(): boolean {
  const c: any = Constants;
  return c?.executionEnvironment === 'storeClient';
}

function getGmaModule(): GoogleMobileAdsModule | null {
  if (Platform.OS === 'web') return null;
  if (isExpoGo()) return null;
  try {
    return require('react-native-google-mobile-ads') as GoogleMobileAdsModule;
  } catch {
    return null;
  }
}

export default function AdBanner() {
  const gma = useMemo(() => getGmaModule(), []);
  const bannerRef = useRef<any>(null);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    const mobileAds = gma?.default;
    if (!mobileAds || didInit) return;
    didInit = true;
    mobileAds().initialize().catch(() => {});
  }, [gma]);

  useEffect(() => {
    if (Platform.OS !== 'ios') return;
    const sub = AppState.addEventListener('change', (state) => {
      if (state === 'active') {
        bannerRef.current?.load?.();
      }
    });

    return () => {
      sub.remove();
    };
  }, []);

  if (!gma?.BannerAd || !gma?.BannerAdSize || !gma?.TestIds) {
    return null;
  }

  const BannerAd = gma.BannerAd;
  const BannerAdSize = gma.BannerAdSize;
  const TestIds = gma.TestIds;

  const prodUnitId =
    Platform.OS === 'ios'
      ? process.env.EXPO_PUBLIC_ADMOB_BANNER_ID_IOS || process.env.EXPO_PUBLIC_ADMOB_BANNER_ID
      // : process.env.EXPO_PUBLIC_ADMOB_BANNER_ID_ANDROID || process.env.EXPO_PUBLIC_ADMOB_BANNER_ID;
      : 'ca-app-pub-4835981370605782/9183779192';

  const unitId = __DEV__ ? TestIds.BANNER : prodUnitId;

  if (Platform.OS === 'web') {
    return null;
  }

  if (!unitId) {
    return null;
  }

  return (
    <View style={[styles.fixedContainer, { bottom: insets.bottom }]} pointerEvents="box-none">
      <BannerAd
        ref={bannerRef}
        unitId={unitId}
        size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
        onAdLoaded={() => {
          if (__DEV__) {
            console.log('[AdBanner] loaded');
          }
        }}
        onAdFailedToLoad={(error: any) => {
          if (__DEV__) {
            console.warn('[AdBanner] failed to load', error);
          }
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  fixedContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 1000,
    elevation: 1000,
  },
});
