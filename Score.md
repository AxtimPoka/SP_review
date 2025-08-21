## 評分架構總覽

總分：300 分，分為三大維度，每維度 100 分：

1. 流程遵守度評分 (Process Adherence) - 100 分
2. 銷售技巧評分 (Sales Skills) - 100 分
3. 溝通能力評分 (Communication) - 100 分

## 評分計算邏輯

- 每個維度包含 1-10 個評分題目
- 維度總分(100 分) ÷ 題目數量 = 每題平均分數
- 每個題目內的選項平均分配該題分數
- 例如：10 個題目的維度，每題 10 分；題目有 5 個選項，每選項 2 分

## 題目類型說明

### 範圍題 (Range Question)

- **評分方式**：根據表現程度給予對應區間分數
- **區間設定**：
  - 80-100%：可得該題 80%-100%分數
  - 60-80%：可得該題 60%-80%分數
  - 40-60%：可得該題 40%-60%分數
  - 20-40%：可得該題 20%-40%分數
  - 0-20%：可得該題 0%-20%分數
- **評分原則**：根據對話內容品質判斷落在哪個區間

### 是非題 (Yes/No Question)

- **評分方式**：每個子項目獨立評分
- **計分邏輯**：
  - 符合標準 = 該子項目滿分
  - 不符合標準 = 該子項目 0 分
  - 題目總分 = 所有子項目得分總和
- **子項目分數**：題目總分 ÷ 子項目數量

## 題目架構

````
        <div class="question-section">
          <div class="question-header">
            <div class="question-title">題目 ${Num} </div>
          </div>
          <div class="form-group">
            <label class="form-label">題目名稱</label>
            <input
              type="text"
              class="form-input"
              value="銷售流程完整性"
              readonly
            />
          </div>
          <div class="form-group">
            <label class="form-label">題型選擇</label>
            <div class="question-type-selector">
              <button class="type-btn" onclick="toggleQuestionType(this, 'range')">範圍題</button>
              <button class="type-btn active" onclick="toggleQuestionType(this, 'yn')">是非題</button>
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">評分標準</label>
            <div class="scoring-standard" id="scoring-yn" style="display: block;">
              <div class="scoring-item">
                <label style="flex: 1;">問題1：</label>
                <input type="text" class="form-input" placeholder="請輸入是非問題" value="" style="flex: 2;">
                <select class="form-input" style="width: 120px; margin-left: 10px;">
                  <option value="yes">是</option>
                  <option value="no">否</option>
                </select>
                <div class="score-display" style="width: 80px; margin-left: 10px; padding: 6px 10px; background: #f8f9fa; border-radius: 6px; text-align: center; font-weight: 600; color: #667eea; border: 2px solid #e1e8ed;">1.9分</div>
                <button class="btn-remove-question" style="margin-left: 10px; background: #ff4757; color: white; border: none; width: 30px; height: 30px; border-radius: 50%; cursor: pointer; display: none;" onclick="removeYesNoQuestion(this)" title="刪除問題">×</button>
              </div>

              <button class="btn-add-option" style="margin-top: 10px; padding: 10px 20px; background: #667eea; color: white; border: none; border-radius: 6px; cursor: pointer;" onclick="addYesNoQuestion(this)">+ 新增問題</button>
            </div>
            <div class="scoring-standard" id="scoring-range" style="display: none;">
              <div class="score-explanation">
                <div class="score-explanation-title">📋 評分標準說明</div>
                <div>• 此題配分：<strong>11.1分</strong></div>
                <div>• 80-100%：可得 <strong>8.9 - 11.1分</strong></div>
                <div>• 60-80%：可得 <strong>6.7 - 8.9分</strong></div>
                <div>• 40-60%：可得 <strong>4.4 - 6.7分</strong></div>
                <div>• 20-40%：可得 <strong>2.2 - 4.4分</strong></div>
                <div>• 0-20%：可得 <strong>0 - 2.2分</strong></div>
              </div>
              <div class="scoring-item">
                <label>80～100%：</label
                ><input
                  type="text"
                  class="form-input"
                  value="描述達到80分的標準"
                />
              </div>
              <div class="scoring-item">
                <label>60~80%：</label
                ><input
                  type="text"
                  class="form-input"
                  value="描述達到60分的標準"
                />
              </div>
              <div class="scoring-item">
                <label>40~60%：</label
                ><input
                  type="text"
                  class="form-input"
                  value="描述達到40分的標準"
                />
              </div>
              <div class="scoring-item">
                <label>20~40%：</label
                ><input
                  type="text"
                  class="form-input"
                  value="描述達到20分的標準"
                />
              </div>
              <div class="scoring-item">
                <label>0~20%：</label
                ><input
                  type="text"
                  class="form-input"
                  value="描述得0分的情況"
                />
              </div>
            </div>
          </div>
          <div class="progress-container">
            <div class="progress-bar">
              <div class="progress-fill" style="width: 33.3%"></div>
            </div>
            <div class="progress-text">
              <span>配分：${Num} 分</span><span>剩餘：${Num} 分</span>
            </div>
          </div>
        </div>
        ```

````
