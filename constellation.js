// Plug in to Constellation UI if Constellation is available
if (!!Constellation) {
  Constellation.addTab({
    name: 'DDP Inspector',
    id: 'ddp-inspector',
    mainContentTemplate: DDP_INSPECTOR_PREFIX,
    menuContentTemplate: DDP_INSPECTOR_SEARCH_TEMPLATE,
    active: true
  });

  Constellation.excludeSessionKeysContaining(DDP_INSPECTOR_PREFIX);
}
