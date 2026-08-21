/**
 * =========================================================================
 * 扩展模块：今日预测数据维度 + 0-8段筛选 (已修正象限网格定义)
 * 说明：自带完整指标定义与底层判断逻辑
 * =========================================================================
 */

 (function () {
  // 1. 维度指标定义：14维度 + 0-8段（9个段位）
  const PREDICTION_INDICATORS = [
      '0路', '1路', '2路',
      '奇数', '偶数',
      '一区', '二区', '三区',
      '质数', '合数',
      '一象限', '二象限', '三象限', '四象限',
      '0段', '1段', '2段', '3段', '4段', '5段', '6段', '7段', '8段'
  ];

  // 2. 维度分组定义
  const CATEGORY_MAP = {
      '012路': ['0路', '1路', '2路'],
      '奇偶': ['奇数', '偶数'],
      '三区': ['一区', '二区', '三区'],
      '质合': ['质数', '合数'],
      '象限': ['一象限', '二象限', '三象限', '四象限'],
      '段位': ['0段', '1段', '2段', '3段', '4段', '5段', '6段', '7段', '8段']
  };

  // 预置象限号码集合（基于 8x10 网格划分）
  const QUADRANT_MAP = {
      '一象限': [6, 7, 8, 9, 10, 16, 17, 18, 19, 20, 26, 27, 28, 29, 30, 36, 37, 38, 39, 40],
      '二象限': [1, 2, 3, 4, 5, 11, 12, 13, 14, 15, 21, 22, 23, 24, 25, 31, 32, 33, 34, 35],
      '三象限': [41, 42, 43, 44, 45, 51, 52, 53, 54, 55, 61, 62, 63, 64, 65, 71, 72, 73, 74, 75],
      '四象限': [46, 47, 48, 49, 50, 56, 57, 58, 59, 60, 66, 67, 68, 69, 70, 76, 77, 78, 79, 80]
  };

  // 自动注入移动端自适应 CSS 样式
  function injectResponsiveStyles() {
      if (document.querySelector('#predResponsiveStyle')) return;
      const style = document.createElement('style');
      style.id = 'predResponsiveStyle';
      style.textContent = `
          #predictionPanelContainer,
          #predResultContainer,
          #predIndicatorCheckboxGroup {
              width: 100% !important;
              max-width: 100% !important;
              box-sizing: border-box !important;
          }
          #predResultContainer {
              overflow-x: auto !important;
              -webkit-overflow-scrolling: touch;
          }
          @media screen and (max-width: 768px) {
              #predIndicatorCheckboxGroup label {
                  font-size: 11px !important;
              }
              #predIndicatorCheckboxGroup input[type="checkbox"] {
                  width: 13px !important;
                  height: 13px !important;
              }
          }
      `;
      document.head.appendChild(style);
  }

  // 初始化预测面板容器
  function initPredictionPanel() {
      injectResponsiveStyles();

      const parentContainer = document.querySelector('#topIndicatorContainer') || document.body;
      if (!parentContainer) return;

      if (document.querySelector('#predictionPanelContainer')) return;

      const predContainer = document.createElement('div');
      predContainer.id = 'predictionPanelContainer';
      predContainer.style.cssText = 'margin-bottom:15px; width:100%; box-sizing:border-box; overflow:visible;';

      parentContainer.parentNode.insertBefore(predContainer, parentContainer);
      renderPredictionUI(predContainer);
  }

  // 判断质数 (01-80)
  function isPrimeNum(num) {
      const n = parseInt(num, 10);
      if (isNaN(n) || n <= 1) return false;
      const primeArr = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79];
      return primeArr.includes(n);
  }

  // 3. 底层精确核对单个号码（包含修正后的象限逻辑与段位逻辑）
  function checkSingleRule(num, indName) {
      const n = parseInt(num, 10);
      if (isNaN(n)) return false;

      switch (indName) {
          // 修正后的网格象限判定
          case '一象限': return QUADRANT_MAP['一象限'].includes(n);
          case '二象限': return QUADRANT_MAP['二象限'].includes(n);
          case '三象限': return QUADRANT_MAP['三象限'].includes(n);
          case '四象限': return QUADRANT_MAP['四象限'].includes(n);

          // 012路
          case '0路': return n % 3 === 0;
          case '1路': return n % 3 === 1;
          case '2路': return n % 3 === 2;

          // 奇偶
          case '奇数': return n % 2 !== 0;
          case '偶数': return n % 2 === 0;

          // 三区
          case '一区': return n >= 1 && n <= 29;
          case '二区': return n >= 30 && n <= 59;
          case '三区': return n >= 60 && n <= 80;

          // 质合
          case '质数': return isPrimeNum(n);
          case '合数': return n > 1 && !isPrimeNum(n);

          // 0-8段（对应 1-9 组）
          case '0段': return n >= 1 && n <= 9;
          case '1段': return n >= 10 && n <= 19;
          case '2段': return n >= 20 && n <= 29;
          case '3段': return n >= 30 && n <= 39;
          case '4段': return n >= 40 && n <= 49;
          case '5段': return n >= 50 && n <= 59;
          case '6段': return n >= 60 && n <= 69;
          case '7段': return n >= 70 && n <= 79;
          case '8段': return n === 80;

          default: return false;
      }
  }

  // 判断号码是否符合选中的所有维度（组内 OR，组间 AND）
  function isMatchedBySelected(num, checkedArray) {
      if (checkedArray.length === 0) return false;

      const selectedGroupMap = {};
      checkedArray.forEach(ind => {
          for (const [catName, items] of Object.entries(CATEGORY_MAP)) {
              if (items.includes(ind)) {
                  if (!selectedGroupMap[catName]) selectedGroupMap[catName] = [];
                  selectedGroupMap[catName].push(ind);
                  break;
              }
          }
      });

      // 组间 AND
      return Object.values(selectedGroupMap).every(itemArr => {
          // 组内 OR
          return itemArr.some(ind => checkSingleRule(num, ind));
      });
  }

  // 渲染页面 UI
  function renderPredictionUI(container) {
      let html = `
          <div style="border: 2px solid #28a745; background: #fcfdfc; padding: 10px; border-radius: 6px; box-sizing: border-box; width: 100%;">
              
              <!-- 标题区 -->
              <div style="font-size: 14px; font-weight: bold; color: #1e7e34; margin-bottom: 8px; display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 4px;">
                  <span>今日预测数据多维筛选</span>
                  <span id="predDataStatus" style="font-size: 11px; font-weight: normal; color: #666;"></span>
              </div>

              <!-- 复选框区 -->
              <div id="predIndicatorCheckboxGroup" style="background: #eef9f1; border: 1px solid #c3e6cb; padding: 8px; border-radius: 4px; display: flex; flex-wrap: wrap; gap: 6px 8px; align-items: center; box-sizing: border-box; width: 100%;">
                  ${PREDICTION_INDICATORS.map(ind => `
                      <label style="font-size: 12px; cursor: pointer; display: inline-flex; align-items: center; user-select: none; margin: 0; white-space: nowrap;">
                          <input type="checkbox" data-pred-ind="true" value="${ind}" style="margin: 0 3px 0 0; vertical-align: middle; width: 14px; height: 14px;">
                          <span>${ind}</span>
                      </label>
                  `).join('')}
                  <button id="resetPredCheckboxBtn" type="button" style="margin-left: auto; font-size: 12px; padding: 2px 8px; cursor: pointer; background: #dc3545; color: #fff; border: none; border-radius: 3px; line-height: 1.2; flex-shrink: 0;">清空已选</button>
              </div>

              <!-- 结果展示区 -->
              <div id="predResultContainer" style="display: none; margin-top: 10px; width: 100%; box-sizing: border-box;"></div>
          </div>
      `;

      container.innerHTML = html;
      bindPredictionEvents();
      updateDataStatus();
  }

  // 获取 knownDataGroups
  function getTargetDataGroups() {
      if (typeof currentSystemConfig !== 'undefined' && currentSystemConfig && Array.isArray(currentSystemConfig.knownDataGroups)) {
          return currentSystemConfig.knownDataGroups;
      }
      return null;
  }

  // 数据状态提示
  function updateDataStatus() {
      const statusEl = document.querySelector('#predDataStatus');
      if (!statusEl) return;

      const groups = getTargetDataGroups();
      if (groups && groups.length > 0) {
          statusEl.innerHTML = `已载入 <strong style="color:#28a745;">${groups.length}</strong> 组预测数据`;
      } else {
          statusEl.innerHTML = `<span style="color:#d9534f;">⚠️ 未找到预测数据 (knownDataGroups)</span>`;
      }
  }

  // 事件绑定
  function bindPredictionEvents() {
      const checkboxes = document.querySelectorAll('input[data-pred-ind="true"]');
      checkboxes.forEach(cb => {
          cb.addEventListener('click', (e) => {
              e.stopPropagation();
          });
          cb.addEventListener('change', (e) => {
              e.stopPropagation();
              handlePredCheckboxChange();
          });
      });

      const resetBtn = document.querySelector('#resetPredCheckboxBtn');
      if (resetBtn) {
          resetBtn.addEventListener('click', (e) => {
              e.stopPropagation();
              checkboxes.forEach(cb => cb.checked = false);
              handlePredCheckboxChange();
          });
      }
  }

  // 过滤并输出结果
  function handlePredCheckboxChange() {
      const checkedBoxs = Array.from(document.querySelectorAll('input[data-pred-ind="true"]:checked'));
      const checkedIndicators = checkedBoxs.map(cb => cb.value);
      const resultBox = document.querySelector('#predResultContainer');
      if (!resultBox) return;

      if (checkedIndicators.length === 0) {
          resultBox.style.display = 'none';
          resultBox.innerHTML = '';
          return;
      }

      const groups = getTargetDataGroups();
      if (!groups || groups.length === 0) {
          resultBox.style.display = 'block';
          resultBox.innerHTML = `
              <div style="padding: 8px; background: #f8d7da; color: #721c24; border-radius: 4px; font-size: 12px; text-align: center;">
                  未发现有效的已知预测数据。
              </div>`;
          return;
      }

      let totalMatchedNums = [];
      let groupResultsHTML = '';

      groups.forEach((groupNums, idx) => {
          const matchedInGroup = groupNums.filter(num => isMatchedBySelected(num, checkedIndicators));
          totalMatchedNums.push(...matchedInGroup);

          const displayStr = matchedInGroup.length > 0 
              ? `[ ${matchedInGroup.join(', ')} ]` 
              : `<span style="color: #aaa;">[ ]</span>`;

          groupResultsHTML += `
              <div style="padding: 6px 0; border-bottom: 1px dashed #e5e5e5; font-size: 12px; display: flex; flex-wrap: wrap; align-items: flex-start; justify-content: space-between; gap: 4px; box-sizing: border-box;">
                  <div style="display: flex; align-items: flex-start; flex: 1; min-width: 140px; word-break: break-all;">
                      <span style="color: #666; font-weight: bold; width: 48px; flex-shrink: 0;">第 ${idx + 1} 组:</span>
                      <span style="color: #1a0dab; font-weight: bold; font-family: monospace; word-break: break-all;">${displayStr}</span>
                  </div>
                  <span style="color: #d9534f; font-size: 11px; white-space: nowrap; flex-shrink: 0; margin-left: auto;">符合 ${matchedInGroup.length} 个</span>
              </div>
          `;
      });

      const uniqueMatchedNums = Array.from(new Set(totalMatchedNums));
      
      let r0 = 0, r1 = 0, r2 = 0;
      let odd = 0, even = 0;
      let z1 = 0, z2 = 0, z3 = 0;
      let prime = 0, composite = 0;
      let q1 = 0, q2 = 0, q3 = 0, q4 = 0;

      // 结果卡片统计
      uniqueMatchedNums.forEach(num => {
          const n = parseInt(num, 10);
          if (isNaN(n)) return;

          if (n % 3 === 0) r0++;
          else if (n % 3 === 1) r1++;
          else r2++;

          n % 2 !== 0 ? odd++ : even++;

          if (n <= 29) z1++;
          else if (n <= 59) z2++;
          else z3++;

          isPrimeNum(n) ? prime++ : composite++;

          // 根据正确网格修正统计
          if (QUADRANT_MAP['一象限'].includes(n)) q1++;
          else if (QUADRANT_MAP['二象限'].includes(n)) q2++;
          else if (QUADRANT_MAP['三象限'].includes(n)) q3++;
          else if (QUADRANT_MAP['四象限'].includes(n)) q4++;
      });

      resultBox.style.display = 'block';

      const stats = [
          { label: '012路', val: `${r0}:${r1}:${r2}` },
          { label: '奇偶', val: `${odd}:${even}` },
          { label: '三区', val: `${z1}:${z2}:${z3}` },
          { label: '质合', val: `${prime}:${composite}` },
          { label: '象限', val: `${q1}:${q2}:${q3}:${q4}` }
      ];

      let statsHTML = stats.map(item => `
          <div style="flex: 1 1 40px; min-width: 44px; background: #f8fcf9; border: 1px solid #d4edda; border-radius: 4px; padding: 3px 2px; text-align: center; box-sizing: border-box;">
              <div style="font-size: 10px; color: #1e7e34; margin-bottom: 2px; white-space: nowrap;">${item.label}</div>
              <div style="font-size: 11px; font-weight: bold; color: #333; white-space: nowrap;">${item.val}</div>
          </div>
      `).join('');

      let html = `
          <div style="background: #fff; border: 1px solid #c3e6cb; padding: 8px; border-radius: 4px; box-sizing: border-box; width: 100%;">
              <div style="font-size: 13px; font-weight: bold; color: #1e7e34; margin-bottom: 6px; word-break: break-all;">
                  🎯 筛选结果 (已选条件：<span style="color: #28a745;">${checkedIndicators.join('、')}</span> | 共符合 <span style="color: #d9534f;">${uniqueMatchedNums.length}</span> 个独立号码)
              </div>

              <!-- 分组号码列表区 -->
              <div style="background: #f4fbf6; border: 1px solid #28a745; border-radius: 4px; padding: 2px 8px; margin-bottom: 8px; box-sizing: border-box; width: 100%;">
                  ${groupResultsHTML}
              </div>

              <!-- 维度比例汇总区 -->
              <div style="display: flex; flex-wrap: wrap; gap: 4px; width: 100%; box-sizing: border-box;">
                  ${statsHTML}
              </div>
          </div>
      `;

      resultBox.innerHTML = html;
  }

  // 自动初始化
  if (document.readyState === 'complete') {
      initPredictionPanel();
  } else {
      window.addEventListener('load', initPredictionPanel);
  }
})();