import { SheriffConfig, sameTag } from '@softarc/sheriff-core';

export const config: SheriffConfig = {
  enableBarrelLess: true,
  modules: {
    'src/app': {
      core: ['type:core'],
      shared: ['type:shared'],
      'domains/<domain>': {
        api: ['type:api', 'domain:<domain>'],
        data: ['type:data', 'domain:<domain>'],
        'feat-<feature>': ['type:feature', 'domain:<domain>'],
        model: ['type:model', 'domain:<domain>'],
      },
    },
  },
  depRules: {
    root: ['type:api', 'type:core', 'type:shared'],
    'type:api': ['type:feature', 'type:data', 'type:model', 'type:shared', 'type:core'],
    'type:feature': ['type:feature', 'type:data', 'type:model', 'type:shared', 'type:core'],
    'type:data': ['type:model', 'type:shared', 'type:core'],
    'type:model': ['type:shared'],
    'type:shared': ['type:shared'],
    'type:core': ['type:shared'],
    'domain:*': [sameTag],
  },
};
