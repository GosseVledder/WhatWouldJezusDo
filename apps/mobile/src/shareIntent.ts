import { registerPlugin, type PluginListenerHandle } from '@capacitor/core';

export interface ShareEvent {
  text: string;
  subject: string;
}

interface ShareIntentPlugin {
  addListener(event: 'shared', cb: (e: ShareEvent) => void): Promise<PluginListenerHandle>;
}

const ShareIntent = registerPlugin<ShareIntentPlugin>('ShareIntent');

export function onShare(cb: (e: ShareEvent) => void): void {
  void ShareIntent.addListener('shared', cb).catch(() => {
    // Not available outside Android.
  });
}
