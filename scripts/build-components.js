/* eslint-disable */
const fs = require('fs');
const path = require('path');

function buildComponents() {
  const blocksDir = './blocks';
  const blocks = fs.readdirSync(blocksDir).filter((dir) => {
    return fs.statSync(path.join(blocksDir, dir)).isDirectory();
  });
  
  const definition = {
    title: 'Blocks',
    id: 'blocks',
    components: [],
  };
  
  const models = {};
  const filters = {};
  
  blocks.forEach((block) => {
    const jsonFile = path.join(blocksDir, block, `_${block}.json`);
    
    if (fs.existsSync(jsonFile)) {
      const content = fs.readFileSync(jsonFile, 'utf8');
      const data = JSON.parse(content);
      
      // Definition
      const blockTitle = data.definitions?.[0]?.title || block;
      definition.components.push({
        id: block,
        title: blockTitle,
        icon: 'extension',
        category: 'general',
      });
      
      // Models
      if (data.models?.[0]) {
        models[block] = {
          title: blockTitle,
          properties: data.models[0].fields,
        };
      }
      
      // Filters
      filters[block] = {
        allowedSections: ['section', 'container'],
      };
    }
  });
  
  // Write files
  fs.writeFileSync('component-definition.json', JSON.stringify(definition, null, 2));
  fs.writeFileSync('component-models.json', JSON.stringify(models, null, 2));
  fs.writeFileSync('component-filters.json', JSON.stringify(filters, null, 2));
  
  console.log(`Built ${blocks.length} blocks`);
}

buildComponents();