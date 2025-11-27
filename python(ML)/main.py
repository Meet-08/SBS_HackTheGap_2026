import os

import joblib
import pandas as pd
from sklearn.compose import ColumnTransformer
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_squared_error, r2_score
from sklearn.model_selection import RandomizedSearchCV, train_test_split
from sklearn.preprocessing import OneHotEncoder

df = pd.read_csv("data/processed_crop_data.csv")


DROP_COLS = [
    "State",
    "District",
    "State_norm",
    "District_norm",
    "Year",
    "Yield_QHa",
    "Yield_QHa_Clipped",
    "Model_ID",
]


def tune_rf(X_train, y_train):
    # Hyperparameters relevant to Random Forest
    params = {
        "n_estimators": [100, 200, 300],
        "max_depth": [10, 20, 30, None],
        "min_samples_split": [2, 5, 10],
        "min_samples_leaf": [1, 2, 4],
        "max_features": ["sqrt", "log2", None],
        "bootstrap": [True, False],
    }

    base = RandomForestRegressor(random_state=8)

    search = RandomizedSearchCV(
        estimator=base,
        param_distributions=params,
        n_iter=25,
        scoring="r2",
        cv=3,
        refit=True,
        n_jobs=-1,
        verbose=1,
        random_state=8,
    )

    search.fit(X_train, y_train)

    return search.best_estimator_


os.makedirs("rf_models", exist_ok=True)

for model_id in sorted(df["Model_ID"].unique()):
    print(f"Processing Model: {model_id}")
    data = df[df["Model_ID"] == model_id].copy()
    X = data.drop(columns=DROP_COLS)
    y = data["Yield_QHa_Clipped"]

    # split set
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=8
    )

    # preprocess: only one-hot for categorical, passthrough numerics
    cat_cols = X.select_dtypes(include=["object"]).columns.tolist()
    preprocessor = ColumnTransformer(
        transformers=[
            ("cat", OneHotEncoder(handle_unknown="ignore"), cat_cols),
        ],
        remainder="passthrough",
    )

    # fit preprocessing
    X_train_p = preprocessor.fit_transform(X_train)
    X_test_p = preprocessor.transform(X_test)

    # tune + train model (Removed X_val/y_val from args as they aren't used in RF fit)
    model = tune_rf(X_train_p, y_train)

    # test predictions
    y_pred = model.predict(X_test_p)
    mse = mean_squared_error(y_test, y_pred)
    r2 = r2_score(y_test, y_pred)

    print(f"Model_ID {model_id} -> MSE: {mse:.4f}, R2: {r2:.4f}")

    # save model & preprocess together
    joblib.dump(
        {"model": model, "preprocessor": preprocessor},
        f"rf_models/model_{model_id}.joblib",
    )
