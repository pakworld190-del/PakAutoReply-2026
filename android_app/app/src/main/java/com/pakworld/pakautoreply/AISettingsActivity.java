package com.pakworld.pakautoreply;

import android.app.AlertDialog;
import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.LinearLayout;
import android.widget.RadioButton;
import android.widget.RadioGroup;
import android.widget.TextView;
import android.widget.Toast;
import androidx.appcompat.app.AppCompatActivity;
import com.pakworld.pakautoreply.ai.AIProvider;
import com.pakworld.pakautoreply.ai.AIProviderAdapter;
import com.pakworld.pakautoreply.ai.AIProviderFactory;
import com.pakworld.pakautoreply.ai.ModelInfo;
import com.pakworld.pakautoreply.util.AIPreferences;
import java.util.List;

/**
 * AISettingsActivity - Master AI Settings Screen
 * Strict adherence to Section 2, 6, 8, 10, 11, 13, 24, 25, 61, 62
 */
public class AISettingsActivity extends AppCompatActivity {

    private TextView tvHeroProviderName;
    private TextView tvHeroTagline;
    private TextView tvHeroPoweredBy;

    private TextView tvSelectedProvider;
    private TextView tvApiKeyTitle;
    private TextView tvApiKeyPreview;
    private TextView tvSelectedModel;
    private TextView tvModelBadge;
    private TextView tvWebsiteUrl;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_ai_settings);

        initViews();
        setupClickListeners();
        updateUI();
    }

    private void initViews() {
        tvHeroProviderName = findViewById(R.id.tv_hero_provider_name);
        tvHeroTagline = findViewById(R.id.tv_hero_tagline);
        tvHeroPoweredBy = findViewById(R.id.tv_hero_powered_by);

        tvSelectedProvider = findViewById(R.id.tv_selected_provider);
        tvApiKeyTitle = findViewById(R.id.tv_api_key_title);
        tvApiKeyPreview = findViewById(R.id.tv_api_key_preview);
        tvSelectedModel = findViewById(R.id.tv_selected_model);
        tvModelBadge = findViewById(R.id.tv_model_badge);
        tvWebsiteUrl = findViewById(R.id.tv_website_url);
    }

    private void setupClickListeners() {
        findViewById(R.id.row_ai_provider).setOnClickListener(v -> showProviderSelectionDialog());
        findViewById(R.id.row_api_key).setOnClickListener(v -> showApiKeyDialog());
        findViewById(R.id.row_ai_model).setOnClickListener(v -> showModelSelectionDialog());

        findViewById(R.id.row_teach_ai).setOnClickListener(v -> showTeachAIDialog());
        findViewById(R.id.row_website).setOnClickListener(v -> showWebsiteDialog());
        findViewById(R.id.row_ai_settings).setOnClickListener(v -> showGeneralSettingsDialog());
        findViewById(R.id.row_ai_parameters).setOnClickListener(v -> showParametersDialog());
    }

    /**
     * Section 24 & 25: Provider Switching
     * Immediately updates Hero Card, API key destination, models, and badges
     */
    private void updateUI() {
        String providerId = AIPreferences.getSelectedProvider(this);
        AIProvider provider = AIProvider.fromId(providerId);
        AIProviderAdapter adapter = AIProviderFactory.getAdapter(provider);

        // 1. Hero Card
        tvHeroProviderName.setText(provider.displayName);
        tvHeroTagline.setText(getString(R.string.ai_hero_tagline));
        tvHeroPoweredBy.setText(String.format(getString(R.string.powered_by_format), provider.poweredBy));

        // 2. AI Provider Row
        tvSelectedProvider.setText(provider.displayName);

        // 3. API Key Row
        tvApiKeyTitle.setText(provider.displayName + " API Key");
        String currentKey = AIPreferences.getApiKey(this, provider.id);
        if (currentKey != null && !currentKey.isEmpty()) {
            if (currentKey.length() > 8) {
                tvApiKeyPreview.setText(currentKey.substring(0, 4) + "••••••••" + currentKey.substring(currentKey.length() - 4));
            } else {
                tvApiKeyPreview.setText("••••••••");
            }
        } else {
            tvApiKeyPreview.setText("Add an API key to use AI replies.");
        }

        // 4. AI Model Row
        String currentModel = AIPreferences.getSelectedModel(this, provider.id);
        tvSelectedModel.setText(currentModel);

        List<ModelInfo> models = adapter.getModels();
        ModelInfo activeModel = null;
        for (ModelInfo m : models) {
            if (m.id.equalsIgnoreCase(currentModel)) {
                activeModel = m;
                break;
            }
        }
        if (activeModel != null) {
            tvModelBadge.setText(activeModel.getFormattedBadge());
            tvModelBadge.setVisibility(View.VISIBLE);
        } else {
            tvModelBadge.setText("AVAILABLE");
            tvModelBadge.setVisibility(View.VISIBLE);
        }

        // 5. Website
        tvWebsiteUrl.setText(AIPreferences.getWebsiteUrl(this));
    }

    /**
     * Section 6 & 7: Provider Selector Dialog
     */
    private void showProviderSelectionDialog() {
        View dialogView = LayoutInflater.from(this).inflate(R.layout.dialog_provider_select, null);
        AlertDialog dialog = new AlertDialog.Builder(this)
                .setView(dialogView)
                .create();

        RadioGroup rg = dialogView.findViewById(R.id.rg_providers);
        String current = AIPreferences.getSelectedProvider(this);

        if ("gemini".equalsIgnoreCase(current)) rg.check(R.id.rb_gemini);
        else if ("openai".equalsIgnoreCase(current)) rg.check(R.id.rb_openai);
        else if ("grok".equalsIgnoreCase(current)) rg.check(R.id.rb_grok);
        else if ("meta".equalsIgnoreCase(current)) rg.check(R.id.rb_meta);
        else if ("elevenlabs".equalsIgnoreCase(current)) rg.check(R.id.rb_elevenlabs);
        else if ("lowlevel".equalsIgnoreCase(current)) rg.check(R.id.rb_lowlevel);

        dialogView.findViewById(R.id.btn_provider_cancel).setOnClickListener(v -> dialog.dismiss());
        dialogView.findViewById(R.id.btn_provider_select).setOnClickListener(v -> {
            int selectedId = rg.getCheckedRadioButtonId();
            String newProvider = "gemini";
            if (selectedId == R.id.rb_openai) newProvider = "openai";
            else if (selectedId == R.id.rb_grok) newProvider = "grok";
            else if (selectedId == R.id.rb_meta) newProvider = "meta";
            else if (selectedId == R.id.rb_elevenlabs) newProvider = "elevenlabs";
            else if (selectedId == R.id.rb_lowlevel) newProvider = "lowlevel";

            AIPreferences.setSelectedProvider(this, newProvider);
            updateUI();
            dialog.dismiss();
            Toast.makeText(this, "Switched to " + AIProvider.fromId(newProvider).displayName, Toast.LENGTH_SHORT).show();
        });

        dialog.show();
    }

    /**
     * Section 10 & 11: Provider-Specific API Key Dialog
     */
    private void showApiKeyDialog() {
        String providerId = AIPreferences.getSelectedProvider(this);
        AIProvider provider = AIProvider.fromId(providerId);

        View dialogView = LayoutInflater.from(this).inflate(R.layout.dialog_api_key, null);
        AlertDialog dialog = new AlertDialog.Builder(this)
                .setView(dialogView)
                .create();

        TextView tvTitle = dialogView.findViewById(R.id.tv_dialog_title);
        TextView tvSub = dialogView.findViewById(R.id.tv_dialog_subtitle);
        EditText etKey = dialogView.findViewById(R.id.et_api_key);
        Button btnGet = dialogView.findViewById(R.id.btn_get_api_key);
        Button btnTest = dialogView.findViewById(R.id.btn_test_api_key);
        TextView tvStatus = dialogView.findViewById(R.id.tv_test_status);

        tvTitle.setText(provider.displayName + " API Key");
        tvSub.setText("Use your API key from " + provider.poweredBy + ".");
        etKey.setText(AIPreferences.getApiKey(this, provider.id));

        // GET API KEY button (Intent.ACTION_VIEW per Section 11)
        btnGet.setOnClickListener(v -> {
            try {
                Intent browserIntent = new Intent(Intent.ACTION_VIEW, Uri.parse(provider.apiKeyUrl));
                startActivity(browserIntent);
            } catch (Exception e) {
                Toast.makeText(this, "Please open browser: " + provider.apiKeyUrl, Toast.LENGTH_LONG).show();
            }
        });

        // TEST API KEY button (Section 32)
        btnTest.setOnClickListener(v -> {
            String testKey = etKey.getText().toString().trim();
            if (testKey.isEmpty()) {
                tvStatus.setText("Please enter key first");
                tvStatus.setVisibility(View.VISIBLE);
                return;
            }
            tvStatus.setText(getString(R.string.testing_key));
            tvStatus.setVisibility(View.VISIBLE);

            AIProviderAdapter adapter = AIProviderFactory.getAdapter(provider);
            boolean ok = adapter.testApiKey(this, testKey);
            if (ok) {
                tvStatus.setText(getString(R.string.connection_success));
            } else {
                tvStatus.setText(getString(R.string.connection_failed));
            }
        });

        dialogView.findViewById(R.id.btn_cancel).setOnClickListener(v -> dialog.dismiss());
        dialogView.findViewById(R.id.btn_save).setOnClickListener(v -> {
            String newKey = etKey.getText().toString().trim();
            AIPreferences.setApiKey(this, provider.id, newKey);
            updateUI();
            dialog.dismiss();
            Toast.makeText(this, "API Key saved for " + provider.displayName, Toast.LENGTH_SHORT).show();
        });

        dialog.show();
    }

    /**
     * Section 13, 15, 16: Model Selection Dialog with RadioGroup
     */
    private void showModelSelectionDialog() {
        String providerId = AIPreferences.getSelectedProvider(this);
        AIProvider provider = AIProvider.fromId(providerId);
        AIProviderAdapter adapter = AIProviderFactory.getAdapter(provider);
        List<ModelInfo> models = adapter.getModels();

        View dialogView = LayoutInflater.from(this).inflate(R.layout.dialog_model_select, null);
        AlertDialog dialog = new AlertDialog.Builder(this)
                .setView(dialogView)
                .create();

        RadioGroup rg = dialogView.findViewById(R.id.rg_models);
        String currentModel = AIPreferences.getSelectedModel(this, provider.id);

        for (int i = 0; i < models.size(); i++) {
            ModelInfo m = models.get(i);
            RadioButton rb = new RadioButton(this);
            rb.setId(i + 100);
            rb.setText(m.displayName + " (" + m.pricingTier + ")");
            rb.setPadding(8, 8, 8, 8);
            rb.setTextColor(getResources().getColor(R.color.text_primary));

            if (m.id.equalsIgnoreCase(currentModel)) {
                rb.setChecked(true);
            }
            rg.addView(rb);
        }

        dialogView.findViewById(R.id.btn_model_cancel).setOnClickListener(v -> dialog.dismiss());
        dialogView.findViewById(R.id.btn_model_select).setOnClickListener(v -> {
            int checkedId = rg.getCheckedRadioButtonId();
            int index = checkedId - 100;
            if (index >= 0 && index < models.size()) {
                ModelInfo chosen = models.get(index);
                AIPreferences.setSelectedModel(this, provider.id, chosen.id);
                updateUI();
                Toast.makeText(this, "Model set to: " + chosen.displayName, Toast.LENGTH_SHORT).show();
            }
            dialog.dismiss();
        });

        dialog.show();
    }

    private void showTeachAIDialog() {
        EditText et = new EditText(this);
        et.setText(AIPreferences.getSystemInstruction(this));
        new AlertDialog.Builder(this)
                .setTitle("Teach AI Instructions")
                .setView(et)
                .setPositiveButton("SAVE", (d, w) -> {
                    AIPreferences.setSystemInstruction(this, et.getText().toString());
                    Toast.makeText(this, "Instructions saved", Toast.LENGTH_SHORT).show();
                })
                .setNegativeButton("CANCEL", null)
                .show();
    }

    private void showWebsiteDialog() {
        EditText et = new EditText(this);
        et.setText(AIPreferences.getWebsiteUrl(this));
        new AlertDialog.Builder(this)
                .setTitle("Website Knowledge URL")
                .setView(et)
                .setPositiveButton("SAVE", (d, w) -> {
                    AIPreferences.setWebsiteUrl(this, et.getText().toString());
                    updateUI();
                    Toast.makeText(this, "Website URL saved", Toast.LENGTH_SHORT).show();
                })
                .setNegativeButton("CANCEL", null)
                .show();
    }

    private void showGeneralSettingsDialog() {
        Toast.makeText(this, "AI Settings: Prefix = [AI Reply], Delay = 2s", Toast.LENGTH_SHORT).show();
    }

    private void showParametersDialog() {
        Toast.makeText(this, "AI Parameters tuned for " + AIPreferences.getSelectedProvider(this), Toast.LENGTH_SHORT).show();
    }
}
